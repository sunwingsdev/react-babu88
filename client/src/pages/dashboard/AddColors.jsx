import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import { FaTrash, FaSave } from "react-icons/fa";

export default function AddColors() {
  const { addToast } = useToasts();
  const [colors, setColors] = useState({
    mainBackgroundColor: "",
    mainBackgroundTextColor: "",
    secondaryButtonBackgroundColor: "",
    secondaryButtonTextColor: "",
    secondaryColor: "",
    noticeBackgroundColor: "",
    noticeTextColor: "",
    mobileSidebarMenuBackgroundColor: "",
    mobileSidebarMenuTextColor: "",
    mobileSidebarMenuIconColor: "",
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState({
    mainBackgroundColor: false,
    mainBackgroundTextColor: false,
    secondaryButtonBackgroundColor: false,
    secondaryButtonTextColor: false,
    secondaryColor: false,
    noticeBackgroundColor: false,
    noticeTextColor: false,
    mobileSidebarMenuBackgroundColor: false,
    mobileSidebarMenuTextColor: false,
    mobileSidebarMenuIconColor: false,
  });
  const [docId, setDocId] = useState(null);
  const baseURL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

  // Fetch existing colors or initialize document
  useEffect(() => {
    const fetchColors = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${baseURL}/theme-color`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          if (errorData.error === "No colors found") {
            // Initialize document
            const initResponse = await fetch(`${baseURL}/theme-color/init`, {
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
            setColors({
              mainBackgroundColor: "",
              mainBackgroundTextColor: "",
              secondaryButtonBackgroundColor: "",
              secondaryButtonTextColor: "",
              secondaryColor: "",
              noticeBackgroundColor: "",
              noticeTextColor: "",
              mobileSidebarMenuBackgroundColor: "",
              mobileSidebarMenuTextColor: "",
              mobileSidebarMenuIconColor: "",
            });
          } else {
            throw new Error(errorData.error || "Failed to fetch colors");
          }
        } else {
          const data = await response.json();
          setColors({
            mainBackgroundColor: data.mainBackgroundColor || "",
            mainBackgroundTextColor: data.mainBackgroundTextColor || "",
            secondaryButtonBackgroundColor: data.secondaryButtonBackgroundColor || "",
            secondaryButtonTextColor: data.secondaryButtonTextColor || "",
            secondaryColor: data.secondaryColor || "",
            noticeBackgroundColor: data.noticeBackgroundColor || "",
            noticeTextColor: data.noticeTextColor || "",
            mobileSidebarMenuBackgroundColor: data.mobileSidebarMenuBackgroundColor || "",
            mobileSidebarMenuTextColor: data.mobileSidebarMenuTextColor || "",
            mobileSidebarMenuIconColor: data.mobileSidebarMenuIconColor || "",
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
    fetchColors();
  }, [addToast]);

  // Handle color update
  const handleColorUpdate = async (field, color) => {
    if (!docId) return;
    if (!color || !/^#[0-9A-F]{6}$/i.test(color)) {
      addToast("Please select a valid hex color", { appearance: "error", autoDismiss: true });
      return;
    }

    setUpdating((prev) => ({ ...prev, [field]: true }));
    try {
      const response = await fetch(`${baseURL}/theme-color/${docId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ field, color }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update color");
      }
      setColors((prev) => ({ ...prev, [field]: color }));
      addToast("Color updated successfully", { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Update error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    } finally {
      setUpdating((prev) => ({ ...prev, [field]: false }));
    }
  };

  // Handle color reset
  const handleReset = async (field) => {
    if (!docId) return;
    try {
      const response = await fetch(`${baseURL}/theme-color/${docId}/${field}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reset color");
      }
      setColors((prev) => ({ ...prev, [field]: "" }));
      addToast("Color reset successfully", { appearance: "success", autoDismiss: true });
    } catch (err) {
      console.error("Reset error:", err);
      addToast(`Error: ${err.message}`, { appearance: "error", autoDismiss: true });
    }
  };

  // Format field names for display
  const formatFieldName = (field) => {
    return field
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-gray-100">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">Manage Theme Colors</h2>
        {loading ? (
          <div className="text-center py-10">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              "mainBackgroundColor",
              "mainBackgroundTextColor",
              "secondaryButtonBackgroundColor",
              "secondaryButtonTextColor",
              "secondaryColor",
              "noticeBackgroundColor",
              "noticeTextColor",
              "mobileSidebarMenuBackgroundColor",
              "mobileSidebarMenuTextColor",
              "mobileSidebarMenuIconColor",
            ].map((field) => (
              <div key={field} className="border border-[#14805e] p-4 rounded-md relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  { field === "secondaryColor" ? "Menu selected background color" :  formatFieldName(field)}
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="color"
                    value={colors[field] || "#000000"}
                    onChange={(e) => setColors((prev) => ({ ...prev, [field]: e.target.value }))}
                    className="w-12 h-12 p-1 rounded-md border border-gray-300"
                    disabled={updating[field] || !docId}
                  />
                  <button
                    onClick={() => handleColorUpdate(field, colors[field])}
                    className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-400"
                    disabled={updating[field] || !docId || !colors[field]}
                  >
                    <FaSave className="text-xl" />
                  </button>
                  {colors[field] && (
                    <button
                      onClick={() => handleReset(field)}
                      className="absolute top-2 right-2 p-2 group rounded-full bg-red-600 hover:bg-white duration-200"
                    >
                      <FaTrash className="text-xl text-white group-hover:text-red-600 duration-200" />
                    </button>
                  )}
                </div>
                {updating[field] && (
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