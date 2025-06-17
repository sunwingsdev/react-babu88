
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { FaEdit, FaSave, FaTimes } from "react-icons/fa";

export default function UserDetails() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const baseURL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/users/single-user/${userId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch user");
        }
        const data = await response.json();
        setUser(data);
        setFormData({
          username: data.username,
          number: data.number,
          referralCode: data.referralCode || "",
          role: data.role,
          balance: data.balance,
          fullName: data.fullName || "",
          dateOfBirth: data.dateOfBirth || "",
          email: data.email || "",
          address: {
            house: data.address?.house || "",
            city: data.address?.city || "",
            thana: data.address?.thana || "",
            district: data.address?.district || "",
            postCode: data.address?.postCode || "",
          },
        });
      } catch (err) {
        console.error("Fetch error:", err);
        addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
        navigate("/dashboard/all-user");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId, navigate, addToast]);

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
    return `৳${Number(amount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("address.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        address: { ...prev.address, [field]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData.username) {
        addToast("Username is required", { appearance: "error", autoDismiss: true });
        return;
      }
      if (!formData.number) {
        addToast("Phone number is required", { appearance: "error", autoDismiss: true });
        return;
      }
      if (!formData.role) {
        addToast("Role is required", { appearance: "error", autoDismiss: true });
        return;
      }
      if (formData.balance < 0) {
        addToast("Balance cannot be negative", { appearance: "error", autoDismiss: true });
        return;
      }

      const response = await fetch(`${baseURL}/users/admin/update-user/${userId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update user");
      }

      const data = await response.json();
      addToast(data.message, { appearance: "success", autoDismiss: true });
      setUser((prev) => ({ ...prev, ...formData }));
      setEditMode(false);
    } catch (err) {
      console.error("Update error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-blue-600"></div>
          <p className="text-gray-600 text-lg font-medium">Loading User Data...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-700">
          <p className="text-gray-600 text-lg font-medium">User not found.</p>
          <button
            onClick={() => navigate("/dashboard/all-user")}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Back to Users
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">User Profile</h2>
          <button
            onClick={() => setEditMode(true)}
            className="flex items-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg hover:bg-indigo-700 transition duration-200 shadow-sm"
          >
            <FaEdit className="mr-2" /> Edit Profile
          </button>
        </div>

        {/* User Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-700">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Personal Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-700 pb-2">Personal Information</h3>
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                {[
                  { label: "Username", value: user.username, bg: "bg-blue-50" },
                  { label: "Full Name", value: user.fullName || "N/A", bg: "bg-indigo-50" },
                  { label: "Date of Birth", value: user.dateOfBirth ? formatDate(user.dateOfBirth) : "N/A", bg: "bg-purple-50" },
                  { label: "Role", value: user.role, bg: "bg-blue-50" },
                  { label: "Referral Code", value: user.referralCode || "N/A", bg: "bg-indigo-50" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between p-4 border-b border-gray-700 last:border-b-0 ${item.bg}`}
                  >
                    <span className="text-gray-800 font-medium">{item.label}</span>
                    <span className="text-gray-900 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-700 pb-2">Financial Information</h3>
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                {[
                  { label: "Balance", value: formatCurrency(user.balance), bg: "bg-green-50" },
                  { label: "Total Deposit", value: formatCurrency(user.deposit), bg: "bg-teal-50" },
                  { label: "Total Withdraw", value: formatCurrency(user.withdraw), bg: "bg-emerald-50" },
                  { label: "Currency", value: user.currency, bg: "bg-green-50" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between p-4 border-b border-gray-700 last:border-b-0 ${item.bg}`}
                  >
                    <span className="text-gray-800 font-medium">{item.label}</span>
                    <span className="text-gray-900 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-700 pb-2">Contact Information</h3>
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                {[
                  { label: "Email", value: user.email || "N/A", bg: "bg-orange-50" },
                  { label: "Primary Number", value: user.primaryNumber || user.number, bg: "bg-amber-50" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between p-4 border-b border-gray-700 last:border-b-0 ${item.bg}`}
                  >
                    <span className="text-gray-800 font-medium">{item.label}</span>
                    <span className="text-gray-900 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-gray-900 border-b-2 border-gray-700 pb-2">Address</h3>
              <div className="border border-gray-700 rounded-lg overflow-hidden">
                {[
                  { label: "House/Street", value: user.address?.house || "N/A", bg: "bg-red-50" },
                  { label: "City", value: user.address?.city || "N/A", bg: "bg-rose-50" },
                  { label: "Thana/Upazila", value: user.address?.thana || "N/A", bg: "bg-pink-50" },
                  { label: "District", value: user.address?.district || "N/A", bg: "bg-red-50" },
                  { label: "Post Code", value: user.address?.postCode || "N/A", bg: "bg-rose-50" },
                ].map((item, index) => (
                  <div
                    key={index}
                    className={`flex justify-between p-4 border-b border-gray-700 last:border-b-0 ${item.bg}`}
                  >
                    <span className="text-gray-800 font-medium">{item.label}</span>
                    <span className="text-gray-900 font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {editMode && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Edit User Profile</h3>
              <button
                onClick={() => setEditMode(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                <FaTimes size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-blue-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-indigo-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                <input
                  type="text"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-purple-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-orange-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Referral Code</label>
                <input
                  type="text"
                  name="referralCode"
                  value={formData.referralCode}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-indigo-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-purple-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-blue-50"
                  required
                >
                  <option value="user">User</option>
                  <option value="agent">Agent</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Balance *</label>
                <input
                  type="number"
                  name="balance"
                  value={formData.balance}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-green-50"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">House/Street</label>
                <input
                  type="text"
                  name="address.house"
                  value={formData.address.house}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-red-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-rose-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thana/Upazila</label>
                <input
                  type="text"
                  name="address.thana"
                  value={formData.address.thana}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-pink-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
                <input
                  type="text"
                  name="address.district"
                  value={formData.address.district}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-red-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Post Code</label>
                <input
                  type="text"
                  name="address.postCode"
                  value={formData.address.postCode}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-gray-700 shadow-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition py-2 px-3 bg-rose-50"
                />
              </div>
              <div className="col-span-1 md:col-span-2 flex justify-end mt-6">
                <button
                  type="submit"
                  className="flex items-center bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition duration-200 shadow-sm"
                >
                  <FaSave className="mr-2" /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}