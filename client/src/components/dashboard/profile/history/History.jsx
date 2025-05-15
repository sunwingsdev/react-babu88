import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useToasts } from "react-toast-notifications";

const History = () => {
  const { addToast } = useToasts();
  const [selectedTab, setSelectedTab] = useState("deposit"); // Default: আমানত
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  // Fetch transactions based on selected tab
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
        console.log("Fetching endpoint:", `${import.meta.env.VITE_BASE_API_URL}${endpoint}`);
        console.log("User ID:", user._id);
        console.log("Token:", localStorage.getItem("userToken"));

        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}${endpoint}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        });
        console.log("Response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          console.log("Error data:", errorData);
          throw new Error(errorData.error || "Failed to fetch transactions");
        }
        const data = await response.json();
        console.log("Fetched data:", data);
        setTransactions(data);
      } catch (err) {
        console.error("Fetch error:", err);
        addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [selectedTab, user,addToast]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  // Status color mapping
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
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4">ইতিহাস</h2>
      <div className="flex flex-wrap gap-2 mb-4 overflow-x-auto">
        <button
          onClick={() => handleTabChange("deposit")}
          className={`py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base ${
            selectedTab === "deposit"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          আমানত
        </button>
        <button
          onClick={() => handleTabChange("withdraw")}
          className={`py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base ${
            selectedTab === "withdraw"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          উত্তোলন
        </button>
        <button
          onClick={() => handleTabChange("evening")}
          className={`py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base ${
            selectedTab === "evening"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          সন্ধ্যার
        </button>
        <button
          onClick={() => handleTabChange("bonus")}
          className={`py-1 px-2 sm:py-2 sm:px-4 rounded text-sm sm:text-base ${
            selectedTab === "bonus"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          বোনাস
        </button>
      </div>
      {loading ? (
        <div className="text-center py-10 text-gray-600 text-sm sm:text-base">লোডিং...</div>
      ) : selectedTab === "evening" || selectedTab === "bonus" ? (
        <div className="text-center py-10 text-gray-600 text-sm sm:text-base">No data</div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-10 text-gray-600 text-sm sm:text-base">
          কোনো ট্রানজ্যাকশন পাওয়া যায়নি।
        </div>
      ) : (
        <div className="block sm:hidden">
          {transactions.map((transaction, index) => (
            <div
              key={index}
              className="border-b p-4 mb-2 bg-white rounded-lg shadow-sm hover:bg-gray-100"
            >
              <div className="flex justify-between">
                <span className="font-semibold text-sm">তারিখ:</span>
                <span className="text-sm">
                  {transaction.date && transaction.time
                    ? `${transaction.date} ${transaction.time}`
                    : new Date(transaction.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-sm">মেথড:</span>
                <span className="text-sm">
                  {transaction.paymentMethod?.methodName || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-sm">চ্যানেল:</span>
                <span className="text-sm">
                  {selectedTab === "deposit"
                    ? transaction.paymentMethod?.gateways || "N/A 2"
                    : transaction.channel || transaction?.gateways || "N/A 2"}
                 {
                    transaction?.gateways
                 }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-semibold text-sm">আইডি:</span>
                <div className="flex items-center">
                  <span className="text-sm">{transaction._id}</span>
                  <button
                    className="ml-2 text-blue-500 text-xs"
                    onClick={() => {
                      navigator.clipboard.writeText(transaction._id);
                      addToast("Deposit ID copied to clipboard", {
                        appearance: "success",
                        autoDismiss: true,
                      });
                    }}
                  >
                    COPY
                  </button>
                </div>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-sm">অ্যামাউন্ট:</span>
                <span className="text-sm">
                  {transaction.amount?.toFixed(2) || "0.00"} ৳
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-sm">স্ট্যাটাস:</span>
                <div className="text-sm">
                  <span className={getStatusColor(transaction.status)}>
                    {transaction.status === "incomplete timeout" ||
                    transaction.status === "rejected"
                      ? "প্রত্যাখ্যান"
                      : transaction.status || "N/A"}
                  </span>
                  <div className="text-gray-500 text-xs">
                    <p>Memo: {transaction.memo || "N/A"}</p>
                    <p>Notes2: {transaction.notes2 || transaction.status || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {!loading &&
        transactions.length > 0 &&
        (selectedTab === "deposit" || selectedTab === "withdraw") && (
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">তারিখ</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Deposit Method</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Payment Channel</th>
                
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Deposit Amount</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">স্ট্যাটাস</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4 text-sm sm:text-base">
                      {transaction.date && transaction.time
                        ? `${transaction.date} ${transaction.time}`
                        : new Date(transaction.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 px-4 text-sm sm:text-base">
                      {transaction.paymentMethod?.methodName }
                      {
                        transaction.paymentMethod?.methodNameBD 
                      }
                    </td>
                    <td className="py-2 px-4 text-sm sm:text-base">
                      {selectedTab === "deposit"
                        ? transaction?.gateways || "N/A"
                        : transaction?.paymentMethod?.gateway || transaction.gateways || "N/A"}
                    </td>
                
                    <td className="py-2 px-4 text-sm sm:text-base">
                      {transaction.amount?.toFixed(2) || "0.00"} ৳
                    </td>
                    <td className="py-2 px-4 text-sm sm:text-base">
                      <span className={getStatusColor(transaction.status)}>
                        {transaction.status === "incomplete timeout" ||
                        transaction.status === "rejected"
                          ? "প্রত্যাখ্যান"
                          : transaction.status || "N/A"}
                      </span>
                      <div className="text-gray-500 text-xs sm:text-sm">
                        <p>Memo: {transaction.memo || "N/A"}</p>
                        <p>Notes2: {transaction.notes2 || transaction.status || "N/A"}</p>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </div>
  );
};

export default History;