import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { FaCopy, FaEye, FaEdit } from "react-icons/fa";

export default function AllUser() {
  const { addToast } = useToasts();
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
  }, []);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `৳${Number(amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  // Copy to clipboard
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    addToast("Copied to clipboard", { appearance: "success", autoDismiss: true });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold mb-4">All Users</h2>
      {loading ? (
        <div className="text-center py-10 text-gray-600 text-sm sm:text-base">
          Loading...
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-10 text-gray-600 text-sm sm:text-base">
          No users found.
        </div>
      ) : (
        <>
          {/* Desktop: Table View */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Username</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Phone Number</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Role</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Balance</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Total Deposit</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Total Withdraw</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Created At</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Last Login</th>
                  <th className="py-2 px-4 border-b text-sm sm:text-base">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-100">
                    <td className="py-2 px-4 text-sm sm:text-base">{user.username}</td>
                    <td className="py-2 px-4 text-sm sm:text-base flex items-center">
                      {user.number}
                      <button
                        className="ml-2 text-blue-500"
                        onClick={() => copyToClipboard(user.number)}
                      >
                        <FaCopy />
                      </button>
                    </td>
                    <td className="py-2 px-4 text-sm sm:text-base capitalize">{user.role}</td>
                    <td className="py-2 px-4 text-sm sm:text-base">{formatCurrency(user.balance)}</td>
                    <td className="py-2 px-4 text-sm sm:text-base">{formatCurrency(user.deposit)}</td>
                    <td className="py-2 px-4 text-sm sm:text-base">{formatCurrency(user.withdraw)}</td>
                    <td className="py-2 px-4 text-sm sm:text-base">{formatDate(user.createdAt)}</td>
                    <td className="py-2 px-4 text-sm sm:text-base">{formatDate(user.lastLoginAt)}</td>
                    <td className="py-2 px-4 text-sm sm:text-base flex space-x-2">
                      <button className="text-blue-500 hover:text-blue-700">
                        <FaEye />
                      </button>
                      <button className="text-green-500 hover:text-green-700">
                        <FaEdit />
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
                className="border-b p-4 mb-2 bg-white rounded-lg shadow-sm hover:bg-gray-100"
              >
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">Username:</span>
                  <span className="text-sm">{user.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-sm">Phone:</span>
                  <div className="flex items-center">
                    <span className="text-sm">{user.number}</span>
                    <button
                      className="ml-2 text-blue-500 text-xs"
                      onClick={() => copyToClipboard(user.number)}
                    >
                      <FaCopy />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">Role:</span>
                  <span className="text-sm capitalize">{user.role}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">Balance:</span>
                  <span className="text-sm">{formatCurrency(user.balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">Deposit:</span>
                  <span className="text-sm">{formatCurrency(user.deposit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">Withdraw:</span>
                  <span className="text-sm">{formatCurrency(user.withdraw)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">Created:</span>
                  <span className="text-sm">{formatDate(user.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-sm">Last Login:</span>
                  <span className="text-sm">{formatDate(user.lastLoginAt)}</span>
                </div>
                <div className="flex justify-end space-x-2 mt-2">
                  <button className="text-blue-500 hover:text-blue-700 text-sm">
                    <FaEye />
                  </button>
                  <button className="text-green-500 hover:text-green-700 text-sm">
                    <FaEdit />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}