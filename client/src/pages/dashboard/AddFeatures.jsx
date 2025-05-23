import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { FaTrash, FaUpload, FaPlus, FaLink } from "react-icons/fa";

export default function AddFeatures() {
  const { addToast } = useToasts();
  const [data, setData] = useState({
    featuresImageMobile: { image: "", links: [] },
    featuresImageDesktop: [],
    download: "",
    downloadApk: "",
    publish: "",
    desktop: "",
  });
  const [newLink, setNewLink] = useState(""); // For featuresImageMobile links
  const [desktopEntries, setDesktopEntries] = useState([{ image: "", link: "" }]); // For featuresImageDesktop entries
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({
    featuresImageMobile: false,
    download: false,
    downloadApk: false,
    publish: false,
    desktop: false,
    featuresImageDesktop: false,
  });
  const [docId, setDocId] = useState(null);
  const baseURL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

  // Fetch existing data
  useEffect(() => {
    const fetchData = async () => {
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
            setData({
              featuresImageMobile: { image: "", links: [] },
              featuresImageDesktop: [],
              download: "",
              downloadApk: "",
              publish: "",
              desktop: "",
            });
          } else {
            throw new Error(errorData.error || "Failed to fetch data");
          }
        } else {
          const fetchedData = await response.json();
          setData({
            featuresImageMobile: fetchedData.featuresImageMobile || { image: "", links: [] },
            featuresImageDesktop: fetchedData.featuresImageDesktop || [],
            download: fetchedData.download || "",
            downloadApk: fetchedData.downloadApk || "",
            publish: fetchedData.publish || "",
            desktop: fetchedData.desktop || "",
          });
          setDocId(fetchedData._id || null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [addToast, baseURL]);

  // Handle image or APK upload
  const handleFileUpload = async (e, field, isApk = false, index = null) => {
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

      const updatePayload = {};
      if (field === "featuresImageMobile") {
        updatePayload.featuresImageMobile = { ...data.featuresImageMobile, image: fileLink };
      } else if (field === "featuresImageDesktop") {
        const updatedDesktopEntries = [...data.featuresImageDesktop];
        updatedDesktopEntries[index] = { ...updatedDesktopEntries[index], image: fileLink };
        updatePayload.featuresImageDesktop = updatedDesktopEntries;
      } else {
        updatePayload[field] = fileLink;
      }

      const updateResponse = await fetch(`${baseURL}/features-image/${docId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update file");
      }
      if (isApk) {
        setData((prev) => ({ ...prev, downloadApk: fileLink }));
      } else if (field === "featuresImageMobile") {
        setData((prev) => ({ ...prev, featuresImageMobile: { ...prev.featuresImageMobile, image: fileLink } }));
      } else if (field === "featuresImageDesktop") {
        setData((prev) => ({
          ...prev,
          featuresImageDesktop: updatePayload.featuresImageDesktop,
        }));
      } else {
        setData((prev) => ({ ...prev, [field]: fileLink }));
      }
      addToast(`${isApk ? "APK" : "Image"} uploaded successfully`, { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Upload error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Handle link addition for featuresImageMobile
  const handleAddLink = async () => {
    if (!newLink) return;
    const updatedLinks = [...data.featuresImageMobile.links, newLink];
    try {
      const updateResponse = await fetch(`${baseURL}/features-image/${docId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featuresImageMobile: { ...data.featuresImageMobile, links: updatedLinks } }),
      });
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update links");
      }
      setData((prev) => ({
        ...prev,
        featuresImageMobile: { ...prev.featuresImageMobile, links: updatedLinks },
      }));
      setNewLink("");
      addToast("Link added successfully", { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Link update error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    }
  };

  // Handle link deletion for featuresImageMobile
  const handleDeleteLink = async (index) => {
    const updatedLinks = data.featuresImageMobile.links.filter((_, i) => i !== index);
    try {
      const updateResponse = await fetch(`${baseURL}/features-image/${docId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featuresImageMobile: { ...data.featuresImageMobile, links: updatedLinks } }),
      });
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update links");
      }
      setData((prev) => ({
        ...prev,
        featuresImageMobile: { ...prev.featuresImageMobile, links: updatedLinks },
      }));
      addToast("Link deleted successfully", { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Link delete error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    }
  };

  // Handle desktop entry addition
  const handleAddDesktopEntry = () => {
    setData((prev) => ({
      ...prev,
      featuresImageDesktop: [...prev.featuresImageDesktop, { image: "", link: "" }],
    }));
  };

  // Handle desktop entry update
  const handleUpdateDesktopEntry = async (index, field, value) => {
    const updatedDesktopEntries = [...data.featuresImageDesktop];
    updatedDesktopEntries[index] = { ...updatedDesktopEntries[index], [field]: value };
    try {
      const updateResponse = await fetch(`${baseURL}/features-image/${docId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featuresImageDesktop: updatedDesktopEntries }),
      });
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to update desktop entry");
      }
      setData((prev) => ({ ...prev, featuresImageDesktop: updatedDesktopEntries }));
      addToast("Desktop entry updated successfully", { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Desktop entry update error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    }
  };

  // Handle image or APK delete
  const handleDelete = async (field, isApk = false, index = null) => {
    if (!docId) return;
    try {
      const doc = await fetch(`${baseURL}/features-image`, {
        headers: { "Content-Type": "application/json" },
      }).then((res) => res.json());
      let filePath;
      if (field === "featuresImageMobile") {
        filePath = doc.featuresImageMobile.image;
      } else if (field === "featuresImageDesktop" && index !== null) {
        filePath = doc.featuresImageDesktop[index].image;
      } else {
        filePath = doc[field];
      }
      if (filePath) {
        await fetch(`${baseURL}/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePath }),
        });
      }
      const updatePayload = {};
      if (field === "featuresImageMobile") {
        updatePayload.featuresImageMobile = { image: "", links: data.featuresImageMobile.links };
      } else if (field === "featuresImageDesktop" && index !== null) {
        const updatedDesktopEntries = [...data.featuresImageDesktop];
        updatedDesktopEntries[index] = { ...updatedDesktopEntries[index], image: "" };
        updatePayload.featuresImageDesktop = updatedDesktopEntries;
      } else {
        updatePayload[field] = "";
      }
      const updateResponse = await fetch(`${baseURL}/features-image/${docId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || `Failed to delete ${isApk ? "APK" : "image"}`);
      }
      if (isApk) {
        setData((prev) => ({ ...prev, downloadApk: "" }));
      } else if (field === "featuresImageMobile") {
        setData((prev) => ({ ...prev, featuresImageMobile: { ...prev.featuresImageMobile, image: "" } }));
      } else if (field === "featuresImageDesktop" && index !== null) {
        setData((prev) => ({ ...prev, featuresImageDesktop: updatePayload.featuresImageDesktop }));
      } else {
        setData((prev) => ({ ...prev, [field]: "" }));
      }
      addToast(`${isApk ? "APK" : "Image"} deleted successfully`, { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Delete error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    }
  };

  // Handle desktop entry deletion
  const handleDeleteDesktopEntry = async (index) => {
    const updatedDesktopEntries = data.featuresImageDesktop.filter((_, i) => i !== index);
    try {
      if (data.featuresImageDesktop[index].image) {
        await fetch(`${baseURL}/delete`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ filePath: data.featuresImageDesktop[index].image }),
        });
      }
      const updateResponse = await fetch(`${baseURL}/features-image/${docId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ featuresImageDesktop: updatedDesktopEntries }),
      });
      if (!updateResponse.ok) {
        const errorData = await updateResponse.json();
        throw new Error(errorData.error || "Failed to delete desktop entry");
      }
      setData((prev) => ({ ...prev, featuresImageDesktop: updatedDesktopEntries }));
      addToast("Desktop entry deleted successfully", { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Desktop entry delete error:", err);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Features Image Mobile */}
            <div className="border border-[#14805e] p-4 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Features Image Mobile</label>
              {data.featuresImageMobile.image ? (
                <div className="relative">
                  <img
                    className="w-full h-40 object-cover rounded-md"
                    src={`${baseURL}${data.featuresImageMobile.image}`}
                    alt="Features Image Mobile"
                  />
                  <button
                    onClick={() => handleDelete("featuresImageMobile")}
                    className="absolute top-2 right-2 p-2 group rounded-full bg-red-600 hover:bg-white duration-200"
                  >
                    <FaTrash className="text-xl text-white group-hover:text-red-600 duration-200" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-md">
                  <label className="cursor-pointer flex flex-col items-center">
                    <FaUpload className="text-2xl text-gray-500" />
                    <span className="text-sm text-gray-600 mt-2">Upload Features Image Mobile</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, "featuresImageMobile")}
                      disabled={uploading.featuresImageMobile || !docId}
                    />
                  </label>
                </div>
              )}
              {uploading.featuresImageMobile && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                </div>
              )}
              {/* Links for Features Image Mobile */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Links</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="url"
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    placeholder="Enter link"
                    className="flex-1 p-2 border rounded-md"
                  />
                  <button
                    onClick={handleAddLink}
                    className="p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={!newLink}
                  >
                    <FaPlus />
                  </button>
                </div>
                {data.featuresImageMobile.links.length > 0 && (
                  <ul className="space-y-2">
                    {data.featuresImageMobile.links.map((link, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                          {link}
                        </a>
                        <button
                          onClick={() => handleDeleteLink(index)}
                          className="p-1 text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Features Image Desktop */}
            <div className="border border-[#14805e] p-4 rounded-md">
              <label className="block text-sm font-medium text-gray-700 mb-2">Features Image Desktop</label>
              <button
                onClick={handleAddDesktopEntry}
                className="mb-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaPlus /> Add Desktop Entry
              </button>
              {data.featuresImageDesktop.map((entry, index) => (
                <div key={index} className="mb-4 p-4 border rounded-md">
                  <div className="relative">
                    {entry.image ? (
                      <>
                        <img
                          className="w-full h-40 object-cover rounded-md"
                          src={`${baseURL}${entry.image}`}
                          alt={`Features Image Desktop ${index + 1}`}
                        />
                        <button
                          onClick={() => handleDelete("featuresImageDesktop", false, index)}
                          className="absolute top-2 right-2 p-2 group rounded-full bg-red-600 hover:bg-white duration-200"
                        >
                          <FaTrash className="text-xl text-white group-hover:text-red-600 duration-200" />
                        </button>
                      </>
                    ) : (
                      <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-md">
                        <label className="cursor-pointer flex flex-col items-center">
                          <FaUpload className="text-2xl text-gray-500" />
                          <span className="text-sm text-gray-600 mt-2">Upload Image</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload(e, "featuresImageDesktop", false, index)}
                            disabled={uploading.featuresImageDesktop || !docId}
                          />
                        </label>
                      </div>
                    )}
                    {uploading.featuresImageDesktop && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-md">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-white"></div>
                      </div>
                    )}
                  </div>
                  <div className="mt-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Link</label>
                    <input
                      type="url"
                      value={entry.link}
                      onChange={(e) => handleUpdateDesktopEntry(index, "link", e.target.value)}
                      placeholder="Enter link"
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <button
                    onClick={() => handleDeleteDesktopEntry(index)}
                    className="mt-2 p-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                  >
                    Delete Entry
                  </button>
                </div>
              ))}
            </div>

            {/* Other Fields */}
            {["download", "publish", "desktop"].map((field) => (
              <div key={field} className="border border-[#14805e] p-4 rounded-md relative">
                <label className="block text-sm font-medium text-gray-700 capitalize mb-2">
                  {field} {field === "download" ? "Image/APK" : "Image"}
                </label>
                {field === "download" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Download APK</label>
                    {data.downloadApk ? (
                      <div className="flex items-center gap-4">
                        <a href={`${baseURL}${data.downloadApk}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
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
                {data[field] ? (
                  <>
                    <img
                      className="w-full h-40 object-cover rounded-md"
                      src={`${baseURL}${data[field]}`}
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