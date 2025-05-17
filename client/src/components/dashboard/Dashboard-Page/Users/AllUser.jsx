import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { useNavigate } from "react-router-dom";
import { FaCopy, FaEye } from "react-icons/fa";

export default function AllUser() {
  const { addToast } = useToasts();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const baseURL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/users/admin/get-users`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch users");
        }
        const data = await response.json();
        setUsers(data.data || []);
      } catch (err) {
        console.error("Fetch error:", err);
        addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [addToast, baseURL]);

  // Format date
  // const formatDate = (dateString) => {
  //   if (!dateString) return "N/A";
  //   return new Date(dateString).toLocaleString("en-US", {
  //     dateStyle: "medium",
  //     timeStyle: "short",
  //   });
  // };

  // Format currency
  const formatCurrency = (amount) => {
    return `৳${Number(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast("Copied to clipboard", { appearance: "success", autoDismiss: true });
  };

  // Navigate to user details
  const goToDetails = (id) => {
    // navigate(`/dashboard/user/userDetails/${id}`);
    navigate(`/dashboard/userDetails/${id}`);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">All Users</h2>
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="text-center py-10 text-gray-600 text-sm sm:text-base">
            No users found.
          </div>
        ) : (
          <>
            {/* Desktop: Table View */}
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Username</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Phone Number</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Role</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Balance</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Total Deposit</th>
                    <th className="py-3 px-4 text-left text-sm font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b hover:bg-gray-50 transition">
                      <td className="py-3 px-4 text-sm text-gray-700">{user.username}</td>
                      <td className="py-3 px-4 text-sm text-gray-700 flex items-center">
                        {user.number}
                        <button
                          className="ml-2 text-blue-500 hover:text-blue-700"
                          onClick={() => copyToClipboard(user.number)}
                        >
                          <FaCopy />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-700 capitalize">{user.role}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{formatCurrency(user.balance)}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">{formatCurrency(user.deposit)}</td>
                      <td className="py-3 px-4 text-sm">
                        <button
                          onClick={() => goToDetails(user._id)}
                          className="flex items-center text-blue-500 hover:text-blue-700"
                        >
                          <FaEye className="mr-1" /> Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile: Card View */}
            <div className="block sm:hidden">
              {users.map((user) => (
                <div
                  key={user._id}
                  className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-gray-800">Username:</span>
                    <span className="text-sm text-gray-600">{user.username}</span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold text-sm text-gray-800">Phone:</span>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600">{user.number}</span>
                      <button
                        className="ml-2 text-blue-500 hover:text-blue-700"
                        onClick={() => copyToClipboard(user.number)}
                      >
                        <FaCopy />
                      </button>
                    </div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-sm text-gray-800">Role:</span>
                    <span className="text-sm text-gray-600 capitalize">{user.role}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-sm text-gray-800">Balance:</span>
                    <span className="text-sm text-gray-600">{formatCurrency(user.balance)}</span>
                  </div>
                  <div className="flex justify-end">
                    <button
                      onClick={() => goToDetails(user._id)}
                      className="flex items-center text-blue-500 hover:text-blue-700 text-sm"
                    >
                      <FaEye className="mr-1" /> Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}