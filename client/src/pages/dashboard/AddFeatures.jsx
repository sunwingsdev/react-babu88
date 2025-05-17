import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { FaTrash, FaUpload } from "react-icons/fa";

export default function AddFeatures() {
  const { addToast } = useToasts();
  const [images, setImages] = useState({ features: "", download: "", publish: "" });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({ features: false, download: false, publish: false });
  const [docId, setDocId] = useState(null);
  const baseURL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

  // Fetch existing images or initialize document
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/features-image`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === "No images found") {
            // Initialize document
            const initResponse = await fetch(`${baseURL}/features-image/init`, {
              method: "POST",
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "application/json",
              },
            });
            if (!initResponse.ok) {
              throw new Error("Failed to initialize document");
            }
            const initData = await initResponse.json();
            setDocId(initData.id);
            setImages({ features: "", download: "", publish: "" });
          } else {
            throw new Error(errorData.error || "Failed to fetch images");
          }
        } else {
          const data = await response.json();
          setImages({
            features: data.features || "",
            download: data.download || "",
            publish: data.publish || "",
          });
          setDocId(data._id || null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [addToast, baseURL]);

  // Handle image upload
  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    setUploading((prev) => ({ ...prev, [field]: true }));
    try {
      // Upload image
      const uploadResponse = await fetch(`${baseURL}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || "Failed to upload image");
      }
      const uploadData = await uploadResponse.json();
      const imageLink = uploadData.filePath;

      // Update specific field
      const updateResponse = await fetch(`${baseURL}/features-image/${docId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, imageLink }),
      });
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update image");
      }
      setImages((prev) => ({ ...prev, [field]: imageLink }));
      addToast("Image uploaded successfully", { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Upload error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Handle image delete
  const handleDelete = async (field) => {
    if (!docId) return;
    try {
      const response = await fetch(`${baseURL}/features-image/${docId}/${field}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to delete image");
      }
      setImages((prev) => ({ ...prev, [field]: "" }));
      addToast("Image deleted successfully", { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Delete error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Manage Feature Images</h2>
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {["features", "download", "publish"].map((field) => (
              <div key={field} className="border border-[#14805e] p-2 rounded-md relative">
                {images[field] ? (
                  <>
                    <img
                      className="w-full h-40 object-cover rounded-md"
                      src={`${baseURL}${images[field]}`}
                      alt={field}
                    />
                    <button
                      onClick={() => handleDelete(field)}
                      className="absolute top-2 right-2 p-2 group rounded-full bg-red-600 hover:bg-white duration-200"
                    >
                      <FaTrash className="text-xl text-white group-hover:text-red-600 duration-200" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-md">
                    <label className="cursor-pointer flex flex-col items-center">
                      <FaUpload className="text-2xl text-gray-500" />
                      <span className="text-sm text-gray-600 mt-2 capitalize">{field} Image</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e, field)}
                        disabled={uploading[field] || !docId}
                      />
                    </label>
                  </div>
                )}
                {uploading[field] && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                    <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}