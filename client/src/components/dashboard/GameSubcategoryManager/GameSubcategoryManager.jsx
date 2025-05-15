import { uploadImage } from "@/hooks/files";
import { useAddCategoryMutation } from "@/redux/features/allApis/categoriesApi/categoriesApi";
import { useState } from "react";
import { FiUpload, FiChevronDown } from "react-icons/fi";
import { useToasts } from "react-toast-notifications";

const GameSubcategoryManager = () => {
  const [addSubcategory, { isLoading }] = useAddCategoryMutation();
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: null,
    category: "",
    value: "",
    title: "",
  });
  const { addToast } = useToasts();

  const categories = [
    { label: "ক্রিকেট", value: "cricket" },
    { label: "ক্যাসিনো", value: "casino" },
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setFormData({
          ...formData,
          image: file,
          imagePreview: URL.createObjectURL(file),
        });
      }
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { filePath } = await uploadImage(formData.image);
    const info = {
      image: filePath,
      category: formData.category,
      value: formData.value,
      title: formData.title,
    };

    const result = await addSubcategory(info);
    if (result.error) {
      addToast(result.error.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (result.data.insertedId) {
      addToast("Subcategory added successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      setFormData({
        image: null,
        imagePreview: null,
        category: "",
        value: "",
        title: "",
      });
    }
  };

  return (
    <div className="md:w-1/4 w-full bg-white rounded-2xl shadow-xl ">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        🎮 Add Game Subcategory
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload with Preview */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subcategory Image
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded-md hover:bg-gray-50 transition">
              <FiUpload className="text-lg" />
              Upload Image
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="hidden"
              />
            </label>
            {formData.imagePreview && (
              <img
                src={formData.imagePreview}
                alt="Preview"
                className="h-16 w-16 rounded object-cover border border-gray-200"
              />
            )}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Category
          </label>
          <div className="relative">
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Subcategory Value */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subcategory Value
          </label>
          <input
            type="text"
            name="value"
            value={formData.value}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., sports_01"
            required
          />
        </div>

        {/* Subcategory Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Subcategory Title
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            placeholder="e.g., Football"
            required
          />
        </div>

        {/* Submit */}
        <div>
          <button
            type="submit"
            disabled={
              isLoading ||
              !formData.category ||
              !formData.value ||
              !formData.title ||
              !formData.image
            }
            className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-sm disabled:bg-slate-400"
          >
            Save Subcategory
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameSubcategoryManager;
