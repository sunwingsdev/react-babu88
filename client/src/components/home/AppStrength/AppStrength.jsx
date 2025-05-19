import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IoClose } from "react-icons/io5";
import image from "@/assets/images/download-app.png";


const AppStrength = () => {
  const [isVisible, setIsVisible] = useState(true);

  const { mainColor, backgroundColor} = useSelector((state) => state.themeColor);



  // Fallback colors if not loaded or error occurs
  const bannerBgColor = backgroundColor || "#BFDBFE"; // Default to blue-100 if backgroundColor is not set
  const buttonBgColor = mainColor || "#FFCD03"; // Default to original button color if mainColor is not set
  let buttonHoverBgColor;
  const darkenColor = (hex, amount) => {
    let color = hex.replace("#", "");
    const num = parseInt(color, 16);
    const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
    const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * amount));
    const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  if (mainColor) {
    buttonHoverBgColor = darkenColor(mainColor, 0.1);
  } else {
    buttonHoverBgColor = "#e5be22"; // Use original hover color if mainColor is not set
  }

  return (
    <>
      {isVisible && (
        <div
          className="md:hidden text-black flex justify-between items-center px-4 py-2"
          style={{ backgroundColor: bannerBgColor }}
        >
          <IoClose
            onClick={() => setIsVisible(false)}
            className="text-3xl w-1/8"
          />
          <div className="flex gap-2">
            <img className="size-10" src={image} alt="Download app" />
            <p className="text-[#3a3a3a] leading-4">
              এখনই আমাদের APP সংস্করণ ডাউনলোড করুন!
            </p>
          </div>
          <button
            className="px-1 py-2 text-base rounded-md text-center text-black transition-all duration-500"
            style={{
              backgroundColor: buttonBgColor,
              ":hover": { backgroundColor: buttonHoverBgColor },
            }}
          >
            ডাউনলোড
          </button>
        </div>
      )}
    </>
  );
};

export default AppStrength;