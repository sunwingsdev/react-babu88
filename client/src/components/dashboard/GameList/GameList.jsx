import DeleteModal from "@/components/shared/modal/DeleteModal";
import { deleteImage, uploadImage } from "@/hooks/files";
import {
  useDeleteGameMutation,
  useGetGamesQuery,
  useUpdateGameMutation,
} from "@/redux/features/allApis/gameApi/gameApi";
import { useGetCategoriesQuery } from "@/redux/features/allApis/categoriesApi/categoriesApi";
import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { FiEdit2, FiUpload, FiChevronDown, FiX } from "react-icons/fi";

const GamesList = () => {
  const { data: games = [], isLoading, isError, refetch } = useGetGamesQuery();
  const { data: categoriesData = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const [deleteGame] = useDeleteGameMutation();
  const [updateGame] = useUpdateGameMutation();
  const { addToast } = useToasts();

  // State for delete modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [item, setItem] = useState(null);

  // State for edit modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    id: "",
    title: "",
    category: "",
    subcategory: "",
    badge: "",
    link: "",
    image: null,
    imagePreview: null,
    oldImage: null,
  });

  // State for filters
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    badge: "",
    search: "",
  });

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

  // Get unique subcategories based on selected category
  const getFilteredSubcategories = (selectedCategory) => {
    if (!selectedCategory || isCategoriesLoading) return [];
    return categoriesData
      .filter((cat) => cat.category === selectedCategory)
      .map((cat) => ({
        label: cat.title,
        value: cat.value,
      }));
  };

  // Filter games based on all active filters
  const filteredGames = games.filter((game) => {
    return (
      (filters.category === "" || game.category === filters.category) &&
      (filters.subcategory === "" ||
        game.subcategory === filters.subcategory) &&
      (filters.badge === "" || game.badge === filters.badge) &&
      (filters.search === "" ||
        game.title.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
  };

  const handleEdit = (game) => {
    setEditFormData({
      id: game._id,
      title: game.title,
      category: game.category,
      subcategory: game.subcategory || "",
      badge: game.badge || "",
      link: game.link || "",
      image: null,
      imagePreview: `${import.meta.env.VITE_BASE_API_URL}${game.image}`,
      oldImage: game.image,
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      const file = files[0];
      if (file) {
        setEditFormData({
          ...editFormData,
          image: file,
          imagePreview: URL.createObjectURL(file),
        });
      }
    } else {
      setEditFormData({
        ...editFormData,
        [name]: value,
        ...(name === "category" ? { subcategory: "" } : {}),
      });
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting edit with ID:", editFormData.id);
    console.log("editFormData:", editFormData);

    if (!editFormData.id) {
      addToast("Invalid game ID", { appearance: "error", autoDismiss: true });
      return;
    }

    const updateData = {
      title: editFormData.title,
      category: editFormData.category,
      subcategory: editFormData.subcategory,
      badge: editFormData.badge,
      link: editFormData.link,
    };

    try {
      // Handle image upload and delete old image if necessary
      if (editFormData.image && editFormData.oldImage) {
        console.log("Deleting old image:", editFormData.oldImage);
        try {
          await deleteImage(editFormData.oldImage);
        } catch (err) {
          console.error("Failed to delete old image:", err);
          addToast(`Failed to delete old image: ${err.message}`, {
            appearance: "warning",
            autoDismiss: true,
          });
        }
        const { filePath } = await uploadImage(editFormData.image);
        updateData.image = filePath;
      }

      console.log("Sending update request with:", {
        id: editFormData.id,
        ...updateData,
      });
      const result = await updateGame({
        id: editFormData.id,
        data: updateData,
      }).unwrap();

      if (result.modifiedCount > 0) {
        addToast("Game updated successfully", {
          appearance: "success",
          autoDismiss: true,
        });
        setIsEditModalOpen(false);
        setEditFormData({
          id: "",
          title: "",
          category: "",
          subcategory: "",
          badge: "",
          link: "",
          image: null,
          imagePreview: null,
          oldImage: null,
        });
        refetch();
      } else {
        addToast("No changes made to the game", {
          appearance: "warning",
          autoDismiss: true,
        });
      }
    } catch (error) {
      console.error("Update error:", error);
      addToast(error.data?.message || `Failed to update game: ${error.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const handleDeleteButtonClick = (item) => {
    setItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const { message } = await deleteImage(item?.image);
      if (message) {
        const result = await deleteGame(item._id);
        if (result.data.deletedCount > 0) {
          addToast("Game deleted successfully", {
            appearance: "success",
            autoDismiss: true,
          });
          refetch();
          setIsDeleteModalOpen(false);
        }
      }
    } catch (error) {
      addToast("Failed to delete game", { appearance: "error", autoDismiss: true });
      console.error("Delete game error:", error);
    }
  };

  if (isLoading || isCategoriesLoading)
    return <div className="text-center py-8">Loading games...</div>;
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">Error loading games</div>
    );

  return (
    <div className="container mx-auto w-full md:w-3/4">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">All Games</h1>

      {/* Filters Section */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-xl font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Game title..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Category Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              name="subcategory"
              value={filters.subcategory}
              onChange={handleFilterChange}
              disabled={!filters.category}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 ${
                !filters.category ? "bg-gray-100" : ""
              }`}
            >
              <option value="">All Subcategories</option>
              {getFilteredSubcategories(filters.category).map((sub) => (
                <option key={sub.value} value={sub.value}>
                  {sub.label}
                </option>
              ))}
            </select>
          </div>

          {/* Badge Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Badge
            </label>
            <select
              name="badge"
              value={filters.badge}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            >
              {badges.map((badge) => (
                <option key={badge.value} value={badge.value}>
                  {badge.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Games Grid */}
      {filteredGames.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <p className="text-gray-500">
            No games found matching your filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredGames.map((game) => (
            <div
              key={game._id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              {/* Game Image with Badge */}
              <div className="relative">
                <img
                  src={`${import.meta.env.VITE_BASE_API_URL}${game.image}`}
                  alt={game.title}
                  className="w-full h-48 object-cover"
                />
                {game.badge && (
                  <span
                    className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white ${
                      game.badge === "new" ? "bg-blue-500" : "bg-red-500"
                    }`}
                  >
                    {game.badge.toUpperCase()}
                  </span>
                )}
              </div>

              {/* Game Info */}
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg truncate">{game.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(game)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit game"
                    >
                      <FiEdit2 className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteButtonClick(game)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete game"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                    {game.category}
                  </span>
                  {game.subcategory && (
                    <span className="bg-gray-100 px-2 py-1 rounded">
                      {
                        categoriesData.find((cat) => cat.value === game.subcategory)?.title || game.subcategory
                      }
                    </span>
                  )}
                </div>

                <div className="flex gap-2 mt-4">
                  <a
                    href={game.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded transition-colors"
                  >
                    Play Now
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        closeModal={() => setIsDeleteModalOpen(false)}
        handleDelete={handleDelete}
      />

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
            >
              <FiX className="w-6 h-6" />
            </button>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              Edit Game
            </h2>
            <form onSubmit={handleEditSubmit} className="space-y-6">
              {/* Image Upload with Preview */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Game Image
                </label>
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 text-sm text-gray-600 rounded-md hover:bg-gray-50 transition">
                    <FiUpload className="text-lg" />
                    Upload Image
                    <input
                      type="file"
                      name="image"
                      accept="image/*"
                      onChange={handleEditChange}
                      className="hidden"
                    />
                  </label>
                  {editFormData.imagePreview && (
                    <img
                      src={editFormData.imagePreview}
                      alt="Preview"
                      className="h-16 w-16 rounded object-cover border border-gray-200"
                    />
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Game Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={editFormData.title}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., Cricket Mania"
                  required
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <div className="relative">
                  <select
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditChange}
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

              {/* Subcategory */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Subcategory
                </label>
                <div className="relative">
                  <select
                    name="subcategory"
                    value={editFormData.subcategory}
                    onChange={handleEditChange}
                    disabled={!editFormData.category}
                    className={`w-full appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                      !editFormData.category ? "bg-gray-100" : ""
                    }`}
                  >
                    <option value="">Select a subcategory</option>
                    {getFilteredSubcategories(editFormData.category).map(
                      (sub) => (
                        <option key={sub.value} value={sub?.title}>
                          {sub.label}
                        </option>
                      )
                    )}
                  </select>
                  <FiChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Badge */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Badge
                </label>
                <div className="relative">
                  <select
                    name="badge"
                    value={editFormData.badge}
                    onChange={handleEditChange}
                    className="w-full appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-10 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    {badges.map((badge) => (
                      <option key={badge.value} value={badge.value}>
                        {badge.label}
                      </option>
                    ))}
                  </select>
                  <FiChevronDown className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Game Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={editFormData.link}
                  onChange={handleEditChange}
                  className="w-full border border-gray-300 rounded-md px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="e.g., https://game.example.com"
                />
              </div>

              {/* Submit */}
              <div>
                <button
                  type="submit"
                  disabled={
                    !editFormData.title || !editFormData.category
                  }
                  className="w-full bg-blue-600 text-white py-2 rounded-md font-medium hover:bg-blue-700 transition shadow-sm disabled:bg-slate-400"
                >
                  Update Game
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GamesList;