import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

const History = () => {
  const { addToast } = useToasts();
  const [selectedTab, setSelectedTab] = useState("deposit");
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchTransactions = async () => {
      if (!user?._id) {
        addToast("ইউজার লগইন করা নেই", { appearance: "error", autoDismiss: true });
        return;
      }

      if (selectedTab === "evening" || selectedTab === "bonus") {
        setTransactions([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const endpoint =
          selectedTab === "deposit"
            ? `/depositTransactions/user/${user._id}`
            : `/withdrawTransactions/user/${user._id}`;
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedTab, user, addToast]);

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "incomplete timeout":
      case "rejected":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          ইতিহাস
        </h2>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {["deposit", "withdraw", "evening", "bonus"].map((tab) => (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              className={`flex-shrink-0 py-2 px-4 rounded-lg font-medium text-sm sm:text-base transition-colors duration-200 ${
                selectedTab === tab
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
              aria-pressed={selectedTab === tab}
            >
              {tab === "deposit"
                ? "আমানত"
                : tab === "withdraw"
                ? "উত্তোলন"
                : tab === "evening"
                ? "সন্ধ্যার"
                : "বোনাস"}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-100 animate-pulse p-4 rounded-lg shadow-sm"
              >
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        ) : selectedTab === "evening" || selectedTab === "bonus" ? (
          <div className="text-center py-12 text-gray-500 text-base sm:text-lg">
            কোনো তথ্য নেই
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12 text-gray-500 text-base sm:text-lg">
            কোনো ট্রানজ্যাকশন পাওয়া যায়নি।
          </div>
        ) : (
          <>
            {/* Mobile View: Card Layout */}
            <div className="block lg:hidden space-y-4">
              {transactions.map((transaction, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <span className="font-semibold text-gray-700">তারিখ:</span>
                    <span className="text-gray-600">
                      {transaction.date && transaction.time
                        ? `${transaction.date} ${transaction.time}`
                        : new Date(transaction.createdAt).toLocaleString()}
                    </span>

                    <span className="font-semibold text-gray-700">মেথড:</span>
                    <span className="text-gray-600">
                       {transaction.paymentMethod?.methodNameBD || transaction.paymentMethod?.methodName || "N/A"}
                    </span>

                    <span className="font-semibold text-gray-700">চ্যানেল:</span>
                    <span className="text-gray-600">
                      {selectedTab === "deposit"
                        ? transaction?.gateways || "N/A"
                        : transaction?.paymentMethod?.gateway ||
                          transaction.gateways ||
                          "N/A"}
                    </span>

                    <span className="font-semibold text-gray-700">আইডি:</span>
                    <div className="flex items-center">
                      <span className="text-gray-600 truncate">
                        {transaction._id}
                      </span>
                      <button
                        className="ml-2 text-blue-500 text-xs font-medium hover:underline"
                        onClick={() => {
                          navigator.clipboard.writeText(transaction._id);
                          addToast("ID copied to clipboard", {
                            appearance: "success",
                            autoDismiss: true,
                          });
                        }}
                        aria-label="Copy transaction ID"
                      >
                        কপি
                      </button>
                    </div>

                    <span className="font-semibold text-gray-700">অ্যামাউন্ট:</span>
                    <span className="text-gray-600">
                      {transaction.amount?.toFixed(2) || "0.00"} ৳
                    </span>

                    <span className="font-semibold text-gray-700">স্ট্যাটাস:</span>
                    <div>
                      <span className={`font-medium ${getStatusColor(transaction.status)}`}>
                        {transaction.status === "incomplete timeout" ||
                        transaction.status === "rejected"
                          ? "প্রত্যাখ্যান"
                          : transaction.status || "N/A"}
                      </span>
                      <div className="text-gray-500 text-xs mt-1">
                   
                        <p>Reason: {transaction.reason || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View: Table Layout */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      তারিখ
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      মেথড
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      চ্যানেল
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      অ্যামাউন্ট
                    </th>
                    <th className="py-3 px-4 text-left text-sm font-semibold text-gray-700">
                      স্ট্যাটাস
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {transaction.date && transaction.time
                          ? `${transaction.date} ${transaction.time}`
                          : new Date(transaction.createdAt).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {transaction.paymentMethod?.methodNameBD || transaction.paymentMethod?.methodName || "N/A"}
                     
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {selectedTab === "deposit"
                          ? transaction?.gateways || "N/A"
                          : transaction?.paymentMethod?.gateway ||
                            transaction.gateways ||
                            "N/A"}
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {transaction.amount?.toFixed(2) || "0.00"} ৳
                      </td>
                      <td className="py-3 px-4 text-sm">
                        <span className={`font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status === "incomplete timeout" ||
                          transaction.status === "rejected"
                            ? "প্রত্যাখ্যান"
                            : transaction.status || "N/A"}
                        </span>
                        <div className="text-gray-500 text-xs mt-1">
                           <p>Reason: {transaction.reason || "N/A"}</p>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default History;