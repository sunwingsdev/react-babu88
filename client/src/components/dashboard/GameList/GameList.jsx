import DeleteModal from "@/components/shared/modal/DeleteModal";
import { deleteImage } from "@/hooks/files";
import {
  useDeleteGameMutation,
  useGetGamesQuery,
} from "@/redux/features/allApis/gameApi/gameApi";
import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { toast } from "react-toastify";

const GamesList = () => {
  const { data: games = [], isLoading, isError, refetch } = useGetGamesQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [item, setItem] = useState(null);
  const [deleteGame] = useDeleteGameMutation();
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    badge: "",
    search: "",
  });
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

  // Get unique subcategories based on selected category
  const getFilteredSubcategories = () => {
    if (!filters.category) return [];
    const subcats = new Set();
    games.forEach((game) => {
      if (game.category === filters.category && game.subcategory) {
        subcats.add(game.subcategory);
      }
    });
    return Array.from(subcats).map((sc) => ({ label: sc, value: sc }));
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
      // Reset dependent filters when parent changes
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
  };

  const handleDeleteButtonClick = (item) => {
    setItem(item);
    setIsOpen(true);
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
          setIsOpen(false);
        }
      }
    } catch (error) {
      toast.error("Failed to delete game");
      console.error("Delete game error:", error);
    }
  };

  if (isLoading)
    return <div className="text-center py-8">Loading games...</div>;
  if (isError)
    return (
      <div className="text-center py-8 text-red-500">Error loading games</div>
    );

  return (
    <>
      {" "}
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
                {getFilteredSubcategories().map((sub) => (
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

                  <div className="flex items-center text-sm text-gray-600 mb-2">
                    <span className="bg-gray-100 px-2 py-1 rounded mr-2">
                      {game.category}
                    </span>
                    {game.subcategory && (
                      <span className="bg-gray-100 px-2 py-1 rounded">
                        {game.subcategory}
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
      </div>
      <DeleteModal
        isOpen={isOpen}
        closeModal={() => setIsOpen(false)}
        handleDelete={handleDelete}
      ></DeleteModal>
    </>
  );
};

export default GamesList;
