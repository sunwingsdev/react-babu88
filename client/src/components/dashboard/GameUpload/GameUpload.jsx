import { uploadImage } from "@/hooks/files";
import { useGetCategoriesQuery } from "@/redux/features/allApis/categoriesApi/categoriesApi";
import { useAddGameMutation } from "@/redux/features/allApis/gameApi/gameApi";
import { useState } from "react";
import { useToasts } from "react-toast-notifications";

const GameUpload = () => {
  const { data: subcategories = [] } = useGetCategoriesQuery();
  const [addGame, { isLoading }] = useAddGameMutation();
  const [formData, setFormData] = useState({
    image: null,
    title: "",
    category: "",
    subcategory: "",
    link: "",
    badge: "",
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [errors, setErrors] = useState({});
  const { addToast } = useToasts();

  const categories = [
    { label: "ক্রিকেট", value: "cricket" },
    { label: "ক্যাসিনো", value: "casino" },
    { label: "স্লট", value: "slot" },
    { label: "টেবিল খেলা", value: "table" },
    { label: "এসবি", value: "sb" },
    { label: "মাছ ধরা", value: "fishing" },
    { label: "ক্র্যাশ", value: "crash" },
  ];

  const badges = [
    { label: "None", value: "" },
    { label: "New", value: "new" },
    { label: "Hot", value: "hot" },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      // Reset subcategory when category changes
      ...(name === "category" ? { subcategory: "" } : {}),
    });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, image: file });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = {};

    if (!formData.title.trim()) validationErrors.title = "Title is required";
    if (!formData.category) validationErrors.category = "Category is required";
    if (!formData.image) validationErrors.image = "Image is required";
    if (!formData.link.trim()) validationErrors.link = "Link is required";

    // Validate subcategory if there are filtered subcategories
    if (filteredSubcategories.length > 0 && !formData.subcategory) {
      validationErrors.subcategory = "Subcategory is required";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    const { filePath } = await uploadImage(formData.image);

    const info = {
      title: formData.title,
      category: formData.category,
      subcategory: formData.subcategory,
      image: filePath,
      link: formData.link,
    };

    const result = await addGame(info);

    if (result.error) {
      addToast(result.error.data.message, {
        appearance: "error",
        autoDismiss: true,
      });
    } else if (result.data.insertedId) {
      addToast("Game added successfully", {
        appearance: "success",
        autoDismiss: true,
      });
      setFormData({
        image: null,
        title: "",
        category: "",
        subcategory: "",
        link: "",
        badge: "",
      });
      setPreviewImage(null);
      setErrors({});
    }
  };

  // Filter subcategories based on selected category
  const filteredSubcategories = subcategories.filter(
    (subcat) => subcat.category === formData.category
  );

  return (
    <div className="w-full md:w-1/4 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Upload Game</h1>

      <form onSubmit={handleSubmit}>
        {/* Image Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Game Image
          </label>
          <div className="flex items-center gap-4">
            <div className="ml-4">
              <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Choose File
                <input
                  type="file"
                  className="sr-only"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="mt-1 text-xs text-gray-500">PNG, JPG up to 5MB</p>
            </div>
            {previewImage && (
              <div className="relative rounded-md overflow-hidden border border-dashed border-gray-300 w-32 h-32 flex items-center justify-center">
                <img
                  src={previewImage}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
          {errors.image && (
            <p className="mt-1 text-sm text-red-600">{errors.image}</p>
          )}
        </div>

        {/* Title */}
        <div className="mb-6">
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Game Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border ${
              errors.title ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="Enter game title"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-6">
          <label
            htmlFor="category"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border ${
              errors.category ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">{errors.category}</p>
          )}
        </div>

        {/* Subcategory (conditional) */}
        {filteredSubcategories.length > 0 && (
          <div className="mb-6">
            <label
              htmlFor="subcategory"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleInputChange}
              className={`block w-full px-3 py-2 border ${
                errors.subcategory ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            >
              <option value="">Select a subcategory</option>
              {filteredSubcategories.map((subcategory) => (
                <option key={subcategory._id} value={subcategory._id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
            {errors.subcategory && (
              <p className="mt-1 text-sm text-red-600">{errors.subcategory}</p>
            )}
          </div>
        )}

        {/* Badge (New/Hot) */}
        <div className="mb-6">
          <label
            htmlFor="badge"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Badge
          </label>
          <select
            id="badge"
            name="badge"
            value={formData.badge}
            onChange={handleInputChange}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          >
            {badges.map((badge) => (
              <option key={badge.value} value={badge.value}>
                {badge.label}
              </option>
            ))}
          </select>
        </div>

        {/* Link */}
        <div className="mb-6">
          <label
            htmlFor="link"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Game Link
          </label>
          <input
            type="text"
            id="link"
            name="link"
            value={formData.link}
            onChange={handleInputChange}
            className={`block w-full px-3 py-2 border ${
              errors.link ? "border-red-500" : "border-gray-300"
            } rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
            placeholder="https://example.com/game"
          />
          {errors.link && (
            <p className="mt-1 text-sm text-red-600">{errors.link}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            disabled={isLoading}
            type="submit"
            className="px-4 py-2 bg-indigo-600 disabled:bg-slate-400 text-white rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Upload Game
          </button>
        </div>
      </form>
    </div>
  );
};

export default GameUpload;
