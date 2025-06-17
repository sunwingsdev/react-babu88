import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";

const WithdrawalHistory = () => {
  const { addToast } = useToasts();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // Fetch all transactions
  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/withdrawTransactions`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
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
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle status update
  const handleStatusUpdate = async (transactionId, status, reason = "") => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/withdrawTransactions/${transactionId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ status, reason }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update transaction");
      }

      const result = await response.json();
      addToast(result.message, { appearance: "success", autoDismiss: true });

      setTransactions((prev) =>
        prev.map((t) =>
          t._id === transactionId ? { ...t, status, reason, updatedAt: new Date() } : t
        )
      );
    } catch (err) {
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    }
  };

  // Handle delete
  const handleDelete = async (transactionId) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/withdrawTransactions/${transactionId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete transaction");
      }

      const result = await response.json();
      addToast(result.message, { appearance: "success", autoDismiss: true });

      setTransactions((prev) => prev.filter((t) => t._id !== transactionId));
    } catch (err) {
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    }
  };

  // Handle approve
  const handleApprove = (transactionId) => {
    handleStatusUpdate(transactionId, "completed");
    closeEditModal();
  };

  // Handle cancel
  const handleCancel = () => {
    if (!cancelReason.trim()) {
      addToast("Please provide a reason for cancellation", { appearance: "error", autoDismiss: true });
      return;
    }
    handleStatusUpdate(selectedTransaction, "cancelled", cancelReason);
    closeEditModal();
  };

  // Open edit modal
  const openEditModal = (transaction) => {
    setSelectedTransaction(transaction._id);
    setCancelReason(transaction.reason || "");
    setIsEditModalOpen(true);
  };

  // Close edit modal
  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setCancelReason("");
    setSelectedTransaction(null);
  };

  // Open details modal
  const openDetailsModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsDetailsModalOpen(true);
  };

  // Close details modal
  const closeDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedTransaction(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="text-2xl font-semibold text-blue-600 animate-pulse">Loading Transactions...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 sm:mb-8">Withdrawal History</h1>
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-700">
            <thead className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xs uppercase">
              <tr>
                <th className="py-4 px-4 sm:px-6">Username</th>
                <th className="py-4 px-4 sm:px-6">Number</th>
                <th className="py-4 px-4 sm:px-6">Method</th>
                <th className="py-4 px-4 sm:px-6">Gateway</th>
                <th className="py-4 px-4 sm:px-6 text-right">Amount</th>
                <th className="py-4 px-4 sm:px-6">Status</th>
                <th className="py-4 px-4 sm:px-6">Date</th>
                <th className="py-4 px-4 sm:px-6 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr
                  key={transaction._id}
                  className="border-b border-gray-200 hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="py-4 px-4 sm:px-6 font-medium">{transaction.userInfo?.username || "Unknown"}</td>
                  <td className="py-4 px-4 sm:px-6">{transaction.userInfo?.number || "N/A"}</td>
                  <td className="py-4 px-4 sm:px-6">{transaction.paymentMethod.methodName}</td>
                  <td className="py-4 px-4 sm:px-6">{transaction.paymentMethod.gateway || "N/A"}</td>
                  <td className="py-4 px-4 sm:px-6 text-right font-medium">৳{transaction.amount.toFixed(2)}</td>
                  <td className="py-4 px-4 sm:px-6">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : transaction.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 sm:px-6">{new Date(transaction.createdAt).toLocaleString()}</td>
                  <td className="py-4 px-4 sm:px-6 text-center">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <button
                        onClick={() => openEditModal(transaction)}
                        disabled={transaction.status === "completed"}
                        className={`py-1.5 px-3 rounded text-white text-xs font-medium transition-colors duration-200 ${
                          transaction.status === "completed"
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700"
                        }`}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(transaction._id)}
                        disabled={transaction.status === "completed"}
                        className={`py-1.5 px-3 rounded text-white text-xs font-medium transition-colors duration-200 ${
                          transaction.status === "completed"
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => openDetailsModal(transaction)}
                        className="py-1.5 px-3 bg-green-600 text-white rounded text-xs font-medium hover:bg-green-700 transition-colors duration-200"
                      >
                        Details
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">Edit Transaction</h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => handleApprove(selectedTransaction)}
                    className="py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 w-full sm:w-auto"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => setCancelReason(cancelReason || "Enter reason below")}
                    className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200 w-full sm:w-auto"
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Cancel Reason</label>
                <textarea
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors duration-200"
                  rows="4"
                  placeholder="Enter reason for cancellation (required for Cancel)"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={closeEditModal}
                className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Close
              </button>
              {cancelReason && (
                <button
                  onClick={handleCancel}
                  className="py-2 px-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
                >
                  Submit Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {isDetailsModalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
          <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Transaction Details</h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* User Info Card */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  User Information
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p><strong>Username:</strong> {selectedTransaction.userInfo?.username || "N/A"}</p>
                  <p><strong>Number:</strong> {selectedTransaction.userInfo?.number || "N/A"}</p>
                  <p><strong>Role:</strong> {selectedTransaction.userInfo?.role || "N/A"}</p>
                  <p><strong>Balance:</strong> ৳{selectedTransaction.userInfo?.balance?.toFixed(2) || "0.00"}</p>
                  <p><strong>Deposit:</strong> ৳{selectedTransaction.userInfo?.deposit?.toFixed(2) || "0.00"}</p>
                  <p>
                    <strong>Joined:</strong>{" "}
                    {selectedTransaction.userInfo?.createdAt
                      ? new Date(selectedTransaction.userInfo.createdAt).toLocaleString()
                      : "N/A"}
                  </p>
                  <p>
                    <strong>Last Login:</strong>{" "}
                    {selectedTransaction.userInfo?.lastLoginAt
                      ? new Date(selectedTransaction.userInfo.lastLoginAt).toLocaleString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              {/* Transaction Info Card */}
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-700 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Transaction Information
                </h3>
                <div className="space-y-3 text-sm text-gray-600">
                  <p><strong>Transaction ID:</strong> {selectedTransaction._id}</p>
                  <p><strong>Payment Method:</strong> {selectedTransaction.paymentMethod.methodName}</p>
                  <p><strong>Gateway:</strong> {selectedTransaction.paymentMethod.gateway || "N/A"}</p>
                  <p><strong>Amount:</strong> ৳{selectedTransaction.amount.toFixed(2)}</p>
                  <p><strong>Channel:</strong> {selectedTransaction.channel || "N/A"}</p>
                  <p><strong>Status:</strong> {selectedTransaction.status}</p>
                  {selectedTransaction.reason && (
                    <p><strong>Reason:</strong> {selectedTransaction.reason}</p>
                  )}
                  <p>
                    <strong>Created At:</strong>{" "}
                    {new Date(selectedTransaction.createdAt).toLocaleString()}
                  </p>
                  <p>
                    <strong>Updated At:</strong>{" "}
                    {new Date(selectedTransaction.updatedAt).toLocaleString()}
                  </p>
                  <div>
                    <strong>User Inputs:</strong>
                    {selectedTransaction.userInputs.map((input) => (
                      <div key={input.name} className="ml-4">
                        <p>
                          {input.labelBD || input.label}:{" "}
                          {input.type === "file" ? (
                            <a
                              href={`${import.meta.env.VITE_BASE_API_URL}${input.value}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              View File
                            </a>
                          ) : (
                            input.value
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={closeDetailsModal}
                className="py-2 px-4 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalHistory;