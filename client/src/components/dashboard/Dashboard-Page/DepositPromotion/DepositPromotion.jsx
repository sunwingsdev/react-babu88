import { useState, useEffect } from "react";

import { toast } from "react-toastify";
import { FaPlus, FaTrash, FaEdit, FaSpinner, FaTimes } from "react-icons/fa";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

// Reusable Input Field Component
const InputField = ({ label, name, value, onChange, required, type = "text" }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className={`mt-1 p-3 w-full border ${value || !required ? "border-gray-300" : "border-red-500"} rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
      required={required}
    />
    {required && !value && (
      <p className="mt-1 text-xs text-red-500">This field is required</p>
    )}
  </div>
);

// Reusable File Input Component
const FileInput = ({ label, onChange, image }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      type="file"
      accept="image/*"
      onChange={onChange}
      className="mt-1 p-3 w-full border border-gray-300 rounded-lg file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 shadow-sm"
    />
    {image && (
      <img
        src={`${import.meta.env.VITE_BASE_API_URL}${image}`}
        alt={`${label} Preview`}
        className="mt-3 h-24 w-auto rounded-lg shadow-sm"
      />
    )}
  </div>
);

// Reusable Rich Text Editor Component
const RichTextEditor = ({ label, name, value, onChange, charCount, maxLength = 5000 }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700">{label}</label>
    <ReactQuill
      theme="snow"
      value={value}
      onChange={(content) => onChange({ target: { name, value: content } })}
      className="mt-1 bg-white border border-gray-300 rounded-lg shadow-sm"
      modules={{
        toolbar: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
          ["clean"],
        ],
      }}
      formats={["header", "bold", "italic", "underline", "strike", "list", "bullet", "link"]}
    />
    <p className="mt-1 text-xs text-gray-500">
      {charCount}/{maxLength} characters
    </p>
    {charCount > maxLength && (
      <p className="mt-1 text-xs text-red-500">Character limit exceeded</p>
    )}
  </div>
);

const DepositPromotion = () => {

  const [promotions, setPromotions] = useState([]);
  const [depositMethods, setDepositMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [methodsLoading, setMethodsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({
    img: "",
    title: "",
    title_bd: "",
    description: "",
    description_bd: "",
    promotion_bonuses: [],
  });
  const [newBonus, setNewBonus] = useState({
    payment_method: "",
    bonus_type: "Fix",
    bonus: 0,
  });
  const [showForm, setShowForm] = useState(false);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [editBonusIndex, setEditBonusIndex] = useState(null);

   

  // Calculate character counts for descriptions
  const descriptionCharCount = formData.description.replace(/<[^>]+>/g, "").length;
  const descriptionBDCharCount = formData.description_bd.replace(/<[^>]+>/g, "").length;
  const maxLength = 5000;

  // Fetch deposit methods with retry
  const fetchDepositMethods = async (retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        setMethodsLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/depositPaymentMethod/deposit-methods`);
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setDepositMethods(data.data || []);
        if (!data.data || data.data.length === 0) {
          toast.warn("No deposit payment methods found. Please add some to create promotion bonuses.", {
            position: "top-right",
          });
        }
        return data.data;
      } catch (error) {
        console.error(`Attempt ${i + 1} failed:`, error);
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          toast.error(`Failed to fetch deposit methods: ${error.message}`, { position: "top-right" });
          return [];
        }
      } finally {
        setMethodsLoading(false);
      }
    }
  };

  // Fetch all deposit promotions and deposit methods
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [promotionsRes, methods] = await Promise.all([
          fetch(`${import.meta.env.VITE_BASE_API_URL}/depositPromotions/deposit-promotions`),
          fetchDepositMethods(),
        ]);

        if (!promotionsRes.ok) {
          throw new Error(`Failed to fetch promotions: ${promotionsRes.status} ${promotionsRes.statusText}`);
        }

        const promotionsData = await promotionsRes.json();
        setPromotions(promotionsData.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error(`Failed to load data: ${error.message}`, { position: "top-right" });
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle text input changes for formData
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file upload
  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const uploadFormData = new FormData();
    uploadFormData.append("image", file);

    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_API_URL}/upload`, {
        method: "POST",
        body: uploadFormData,
      });
      if (!response.ok) throw new Error(`Failed to upload image: ${response.statusText}`);
      const data = await response.json();
      setFormData({ ...formData, img: data.filePath });
      toast.success("Image uploaded successfully!", { position: "top-right" });
    } catch (error) {
      console.error("Image upload error:", error);
      toast.error(`Failed to upload image: ${error.message}`, { position: "top-right" });
    }
  };

  // Handle bonus input changes
  const handleBonusInputChange = (e) => {
    const { name, value } = e.target;
    setNewBonus({ ...newBonus, [name]: name === "bonus" ? parseFloat(value) || 0 : value });
  };

  // Add or update a promotion bonus
  const addOrUpdateBonus = () => {
    if (!newBonus.payment_method || newBonus.bonus < 0) {
      toast.error("Please select a payment method and enter a valid bonus amount.", {
        position: "top-right",
      });
      return;
    }

    if (editBonusIndex !== null) {
      const updatedBonuses = formData.promotion_bonuses.map((bonus, index) =>
        index === editBonusIndex ? newBonus : bonus
      );
      setFormData({ ...formData, promotion_bonuses: updatedBonuses });
    } else {
      setFormData({
        ...formData,
        promotion_bonuses: [...formData.promotion_bonuses, newBonus],
      });
    }

    setNewBonus({ payment_method: "", bonus_type: "Fix", bonus: 0 });
    setEditBonusIndex(null);
    setShowBonusModal(false);
    toast.success("Promotion bonus added/updated successfully.", { position: "top-right" });
  };

  // Edit a promotion bonus
  const editBonus = (index) => {
    setNewBonus(formData.promotion_bonuses[index]);
    setEditBonusIndex(index);
    setShowBonusModal(true);
  };

  // Remove a promotion bonus
  const removeBonus = (index) => {
    if (window.confirm("Are you sure you want to remove this promotion bonus?")) {
      setFormData({
        ...formData,
        promotion_bonuses: formData.promotion_bonuses.filter((_, i) => i !== index),
      });
      toast.success("Promotion bonus removed successfully.", { position: "top-right" });
    }
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log formData for debugging
   // console.log("Form Data before submission:", formData);

    // Validate required fields
    if (descriptionCharCount > maxLength || descriptionBDCharCount > maxLength) {
      toast.error("Descriptions exceed character limit.", { position: "top-right" });
      return;
    }
    if (!formData.title) {
      toast.error("Title (EN) is required.", { position: "top-right" });
      return;
    }
    if (!formData.title_bd) {
      toast.error("Title (BD) is required.", { position: "top-right" });
      return;
    }
    if (!formData.img) {
      toast.error("Promotion image is required.", { position: "top-right" });
      return;
    }
    if (!isEditMode && formData.promotion_bonuses.length === 0) {
      toast.error("At least one promotion bonus is required for new promotions.", { position: "top-right" });
      return;
    }

    try {
      const url = isEditMode
        ? `${import.meta.env.VITE_BASE_API_URL}/depositPromotions/deposit-promotion/${editId}`
        : `${import.meta.env.VITE_BASE_API_URL}/depositPromotions/deposit-promotion`;
      const method = isEditMode ? "PUT" : "POST";

      // Create FormData for submission
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("title_bd", formData.title_bd);
      formDataToSend.append("description", formData.description || "");
      formDataToSend.append("description_bd", formData.description_bd || "");
      formDataToSend.append("promotion_bonuses", JSON.stringify(formData.promotion_bonuses));
      formDataToSend.append("img", formData.img);

    

      const response = await fetch(url, {
        method,
        body: JSON.stringify(Object.fromEntries(formDataToSend)), // Send JSON stringified object
        headers: {
          "Content-Type": "application/json", // Set content type to JSON
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to ${isEditMode ? "update" : "create"} promotion`);
      }
      const data = await response.json();

      if (isEditMode) {
        setPromotions(
          promotions.map((promotion) =>
            promotion._id === editId ? { _id: editId, ...data.data } : promotion
          )
        );
      } else {
        setPromotions([...promotions, data.data]);
      }

      toast.success(data.message, { position: "top-right" });
      resetForm();
      setShowForm(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        `Failed to ${isEditMode ? "update" : "create"} promotion: ${error.message}`,
        { position: "top-right" }
      );
    }
  };

  // Handle edit promotion
  const handleEdit = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/depositPromotions/deposit-promotion/${id}`
      );
      if (!response.ok) throw new Error(`Failed to fetch promotion: ${response.statusText}`);
      const data = await response.json();
      setFormData(data.data);
      setEditId(id);
      setIsEditMode(true);
      setShowForm(true);
    } catch (error) {
      console.error("Edit promotion error:", error);
      toast.error(`Failed to load promotion: ${error.message}`, { position: "top-right" });
    }
  };

  // Handle delete promotion
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this promotion?")) {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_API_URL}/depositPromotions/deposit-promotion/${id}`,
          { method: "DELETE" }
        );
        if (!response.ok) throw new Error(`Failed to delete promotion: ${response.statusText}`);
        setPromotions(promotions.filter((promotion) => promotion._id !== id));
        toast.success("Promotion deleted successfully.", { position: "top-right" });
      } catch (error) {
        console.error("Delete promotion error:", error);
        toast.error(`Failed to delete promotion: ${error.message}`, { position: "top-right" });
      }
    }
  };

  // Reset form and modal
  const resetForm = () => {
    setFormData({
      img: "",
      title: "",
      title_bd: "",
      description: "",
      description_bd: "",
      promotion_bonuses: [],
    });
    setNewBonus({ payment_method: "", bonus_type: "Fix", bonus: 0 });
    setEditBonusIndex(null);
    setIsEditMode(false);
    setEditId(null);
    setShowBonusModal(false);
  };

  // Debug button click
  const handleAddBonusClick = () => {
    setNewBonus({ payment_method: "", bonus_type: "Fix", bonus: 0 });
    setEditBonusIndex(null);
    setShowBonusModal(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <FaSpinner className="animate-spin text-blue-600 text-4xl" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-100 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Deposit Promotions</h1>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 shadow-md"
        >
          <FaPlus className="mr-2" /> Add New Promotion
        </button>
      </div>

      {/* Promotions Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden mb-8">
        {promotions.length === 0 ? (
          <p className="p-6 text-gray-600 text-center">No promotions found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Title (EN)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Title (BD)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotions.map((promotion) => (
                  <tr key={promotion._id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {promotion.title}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {promotion.title_bd}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => handleEdit(promotion._id)}
                        className="text-blue-500 hover:text-blue-700 mr-4"
                        title="Edit Promotion"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(promotion._id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete Promotion"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Form for Creating/Editing Promotion */}
      {showForm && (
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {isEditMode ? "Edit Deposit Promotion" : "Add Deposit Promotion"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Image */}
              <FileInput label="Promotion Image" onChange={handleFileUpload} image={formData.img} />

              {/* Title (EN) */}
              <InputField
                label="Title (EN)"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />

              {/* Title (BD) */}
              <InputField
                label="Title (BD)"
                name="title_bd"
                value={formData.title_bd}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description (EN) */}
            <RichTextEditor
              label="Description (EN)"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              charCount={descriptionCharCount}
              maxLength={maxLength}
            />

            {/* Description (BD) */}
            <RichTextEditor
              label="Description (BD)"
              name="description_bd"
              value={formData.description_bd}
              onChange={handleInputChange}
              charCount={descriptionBDCharCount}
              maxLength={maxLength}
            />

            {/* Promotion Bonuses */}
            <div>
              <button
                type="button"
                onClick={handleAddBonusClick}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 shadow-sm"
              >
                <FaPlus className="mr-2" /> Add Promotion Bonus
              </button>
              {methodsLoading ? (
                <p className="mt-2 text-sm text-gray-600">Loading payment methods...</p>
              ) : depositMethods.length === 0 ? (
                <p className="mt-2 text-sm text-gray-600">
                  No deposit payment methods available. Please add some first.
                </p>
              ) : null}
              {formData.promotion_bonuses.length > 0 && (
                <div className="mt-4 space-y-3">
                  {formData.promotion_bonuses.map((bonus, index) => {
                    const method = depositMethods.find((m) => m._id === bonus.payment_method);
                    return (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-200"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Payment Method: {method ? method.methodNameEN : "Unknown"}
                          </p>
                          <p className="text-sm text-gray-600">Bonus Type: {bonus.bonus_type}</p>
                          <p className="text-sm text-gray-600">Bonus: {bonus.bonus}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => editBonus(index)}
                            className="text-blue-500 hover:text-blue-700"
                            title="Edit Bonus"
                          >
                            <FaEdit />
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBonus(index)}
                            className="text-red-500 hover:text-red-700"
                            title="Remove Bonus"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-400 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition duration-200 shadow-sm"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 transition duration-200 shadow-sm"
              >
                <FaPlus className="mr-2" /> {isEditMode ? "Update" : "Create"} Promotion
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Promotion Bonus Modal */}
      {showBonusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 animate-fade-in">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl relative">
            <button
              onClick={() => setShowBonusModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              title="Close"
            >
              <FaTimes />
            </button>
            <h3 className="text-xl font-semibold text-gray-800 mb-6">
              {editBonusIndex !== null ? "Edit Promotion Bonus" : "Add Promotion Bonus"}
            </h3>
            <div className="space-y-4">
              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                {methodsLoading ? (
                  <p className="mt-1 text-sm text-gray-600">Loading payment methods...</p>
                ) : depositMethods.length === 0 ? (
                  <p className="mt-1 text-sm text-gray-600">
                    No deposit payment methods available. Please add some first.
                  </p>
                ) : (
                  <select
                    name="payment_method"
                    value={newBonus.payment_method}
                    onChange={handleBonusInputChange}
                    className={`mt-1 p-3 w-full border ${
                      newBonus.payment_method ? "border-gray-300" : "border-red-500"
                    } rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm`}
                  >
                    <option value="">Select Payment Method</option>
                    {depositMethods.map((method) => (
                      <option key={method._id} value={method._id}>
                        {method.methodNameEN}
                      </option>
                    ))}
                  </select>
                )}
                {!newBonus.payment_method && !methodsLoading && (
                  <p className="mt-1 text-xs text-red-500">This field is required</p>
                )}
              </div>

              {/* Bonus Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700">Bonus Type</label>
                <select
                  name="bonus_type"
                  value={newBonus.bonus_type}
                  onChange={handleBonusInputChange}
                  className="mt-1 p-3 w-full border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                >
                  <option value="Fix">Fix</option>
                  <option value="Percentage">Percentage</option>
                </select>
              </div>

              {/* Bonus Amount */}
              <InputField
                label="Bonus Amount"
                name="bonus"
                type="number"
                value={newBonus.bonus}
                onChange={handleBonusInputChange}
                required
              />
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="button"
                onClick={addOrUpdateBonus}
                className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:from-blue-700 hover:to-blue-600 transition duration-200 shadow-sm"
                disabled={methodsLoading || depositMethods.length === 0}
              >
                <FaPlus className="mr-2" /> {editBonusIndex !== null ? "Update" : "Add"} Bonus
              </button>
              <button
                type="button"
                onClick={() => setShowBonusModal(false)}
                className="px-4 py-2 bg-gradient-to-r from-gray-500 to-gray-400 text-white rounded-lg hover:from-gray-600 hover:to-gray-500 transition duration-200 shadow-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepositPromotion;