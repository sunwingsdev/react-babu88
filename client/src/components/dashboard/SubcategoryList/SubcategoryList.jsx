import { useGetCategoriesQuery } from "@/redux/features/allApis/categoriesApi/categoriesApi";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

const SubcategoryList = () => {
  const { data: subcategories } = useGetCategoriesQuery();

  const handleEdit = (subcategory) => {
    console.log("Edit:", subcategory);
  };

  const handleDelete = (subcategory) => {
    console.log("Delete:", subcategory);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-800 text-center mb-10">
        🎮 Game Subcategory List
      </h2>

      {subcategories?.length === 0 ? (
        <p className="text-center text-gray-500">No subcategories available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {subcategories?.map((sub, index) => (
            <div
              key={index}
              className="relative bg-white rounded-xl shadow hover:shadow-md transition duration-200 border border-gray-200 overflow-hidden"
            >
              {/* Actions - top right */}
              <div className="absolute top-2 right-2 flex gap-1 z-10">
                <button
                  onClick={() => handleEdit(sub)}
                  className="text-blue-600 hover:text-blue-800 p-1.5 rounded-full bg-blue-50 hover:bg-blue-200 transition"
                  title="Edit"
                >
                  <FiEdit2 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(sub)}
                  className="text-red-600 hover:text-red-800 p-1.5 rounded-full bg-red-50 hover:bg-red-200 transition"
                  title="Delete"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>

              {/* Image */}
              <div className="h-32 bg-gray-100">
                <img
                  src={`${import.meta.env.VITE_BASE_API_URL}${sub.image}`}
                  alt={sub.title}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              {/* Content */}
              <div className="p-4 space-y-1">
                <h3 className="text-lg font-semibold text-gray-800 truncate">
                  {sub.title}
                </h3>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Category:</span> {sub.category}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Value:</span> {sub.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SubcategoryList;
