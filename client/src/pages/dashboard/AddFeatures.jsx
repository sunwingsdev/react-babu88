import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { FaTrash, FaUpload } from "react-icons/fa";

export default function AddFeatures() {
  const { addToast } = useToasts();
  const [images, setImages] = useState({ features: "", download: "", publish: "", desktop: "" });
  const [apkFile, setApkFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({ features: false, download: false, publish: false, desktop: false });
  const [docId, setDocId] = useState(null); // docId স্টেট যোগ করা হয়েছে
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
            setImages({ features: "", download: "", publish: "", desktop: "" });
            setApkFile("");
          } else {
            throw new Error(errorData.error || "Failed to fetch images");
          }
        } else {
          const data = await response.json();
          setImages({
            features: data.features || "",
            download: data.download || "",
            publish: data.publish || "",
            desktop: data.desktop || "",
          });
          setApkFile(data.downloadApk || "");
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

  // Handle image or APK upload
  const handleFileUpload = async (e, field, isApk = false) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append(isApk ? "apk" : "image", file);

    setUploading((prev) => ({ ...prev, [field]: true }));
    try {
      const uploadResponse = await fetch(`${baseURL}/features-image/upload${isApk ? "-apk" : ""}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formData,
      });
      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.error || `Failed to upload ${isApk ? "APK" : "image"}`);
      }
      const uploadData = await uploadResponse.json();
      const fileLink = uploadData.filePath;

      const updateResponse = await fetch(`${baseURL}/features-image/${docId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, fileLink }),
      });
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update file");
      }
      if (isApk) {
        setApkFile(fileLink);
      } else {
        setImages((prev) => ({ ...prev, [field]: fileLink }));
      }
      addToast(`${isApk ? "APK" : "Image"} uploaded successfully`, { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Upload error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Handle image or APK delete
  const handleDelete = async (field, isApk = false) => {
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
        throw new Error(errorData.error || `Failed to delete ${isApk ? "APK" : "image"}`);
      }
      if (isApk) {
        setApkFile("");
      } else {
        setImages((prev) => ({ ...prev, [field]: "" }));
      }
      addToast(`${isApk ? "APK" : "Image"} deleted successfully`, { appearance: "success", autoDismiss: true });
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
            {["features", "download", "publish", "desktop"].map((field) => (
              <div key={field} className="border border-[#14805e] p-2 rounded-md relative">
                <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
                  {field} {field === "download" ? "Image/APK" : "Image"}
                </label>
                {field === "download" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Download APK</label>
                    {apkFile ? (
                      <div className="flex items-center gap-4">
                        <a href={`${baseURL}${apkFile}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          View APK
                        </a>
                        <button
                          onClick={() => handleDelete("downloadApk", true)}
                          className="p-2 rounded-full bg-red-600 hover:bg-white duration-200"
                        >
                          <FaTrash className="text-xl text-white group-hover:text-red-600 duration-200" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer flex flex-col items-center">
                        <FaUpload className="text-2xl text-gray-500" />
                        <span className="text-sm text-gray-600 mt-2">Upload APK</span>
                        <input
                          type="file"
                          accept=".apk"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, "downloadApk", true)}
                          disabled={uploading.download || !docId}
                        />
                      </label>
                    )}
                  </div>
                )}
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
                        onChange={(e) => handleFileUpload(e, field)}
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