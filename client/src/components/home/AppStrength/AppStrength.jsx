import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import image from "@/assets/images/download-app.png";

const AppStrength = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [downloadAPK, setDownloadAPK] = useState("");

  const { mainColor, backgroundColor , mainBackgroundTextColor , mainBackgroundColor ,secondaryButtonBackgroundColor,secondaryButtonTextColor } = useSelector((state) => state.themeColor);

  const baseURL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

  

  // Fetch publish and download images
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`${baseURL}/features-image`, {
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch images");
        }
        const data = await response.json();
        setDownloadAPK(data.downloadApk || "");
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    fetchImages();
  }, []);

  // Function to handle APK download
  const handleDownload = () => {
    if (downloadAPK) {
      const link = document.createElement("a");
      link.href = `${baseURL}${downloadAPK}`; // Prepend baseURL to the downloadApk path
      link.download = "babu88.apk"; // Optional: specify the filename for download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link); // Clean up
    } else {
      console.error("No APK URL available for download");
    }
  };

  // Fallback colors if not loaded or error occurs
  const bannerBgColor = backgroundColor || "#BFDBFE"; // Default to blue-100
  const buttonBgColor = mainColor || "#FFCD03"; // Default to original button color
  const darkenColor = (hex, amount) => {
    let color = hex.replace("#", "");
    const num = parseInt(color, 16);
    const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
    const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * amount));
    const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  const buttonHoverBgColor = mainColor ? darkenColor(mainColor, 0.1) : "#e5be22";

  return (
    <>
      {isVisible && (
        <div
          className="md:hidden text-black flex justify-between items-center px-4 py-2"
          style={{ backgroundColor: mainBackgroundColor }}
        >
       
          <IoClose
            onClick={() => setIsVisible(false)}
            className="text-3xl w-1/8"
          />
          <div className="flex gap-2">
            <img className="size-10" src={image} alt="Download app" />
            <p className="leading-4" style={{ color: mainBackgroundTextColor }}>
              এখনই আমাদের APP সংস্করণ ডাউনলোড করুন!
            </p>
          </div>
          <button
            className="px-1 py-2 text-base rounded-md text-center transition-all duration-500"
            style={{
              backgroundColor: secondaryButtonBackgroundColor,
              color: secondaryButtonTextColor,
            }}
            onClick={handleDownload} // Add onClick event handler
          >
            ডাউনলোড
          </button>
        </div>
      )}
    </>
  );
};

export default AppStrength;