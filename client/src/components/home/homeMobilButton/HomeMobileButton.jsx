import { useSelector } from "react-redux";

const HomeMobileButton = ({ image, title, isActive, onClick }) => {
  const { mainColor, backgroundColor } = useSelector((state) => state.themeColor);

  // Utility to darken a hex color for hover effect
  const darkenColor = (hex, amount) => {
    let color = hex.replace("#", "");
    const num = parseInt(color, 16);
    const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
    const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * amount));
    const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  // Utility to determine if a color is dark for contrast
  const isDarkColor = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance < 0.5;
  };

  // Fallback colors if not loaded or error occurs
  const bannerBgColor = backgroundColor || "#BFDBFE"; // Default to blue-100 if backgroundColor is not set
  const buttonBgColor = mainColor || "#FFCD03"; // Default to original button color if mainColor is not set
  let buttonHoverBgColor = mainColor ? darkenColor(mainColor, 0.1) : "#e5be22"; // Darken mainColor for hover or use original hover

  // Dynamic text colors based on background luminance
  const activeTextColor = isDarkColor(buttonBgColor) ? mainColor : backgroundColor;
  const inactiveTextColor = isDarkColor(bannerBgColor) ? backgroundColor  :  mainColor ;

  return (
    <button
      onClick={onClick}
      className={`min-w-[74px] inline-flex flex-col gap-1 items-center justify-center whitespace-nowrap p-2 text-xs font-medium rounded-sm transition-all duration-300 mobile-button ${
        isActive ? `${activeTextColor}` : `${inactiveTextColor}`
      }`}
      style={{
        backgroundColor: isActive ? buttonBgColor : bannerBgColor,
        color: isActive ? inactiveTextColor  : activeTextColor,
      }}
    >
      <style>
        {`
          .mobile-button:hover {
            background-color: ${buttonHoverBgColor};
            color: ${isDarkColor(buttonHoverBgColor) ? activeTextColor : inactiveTextColor};
          }
        `}
      </style>
      <img className="w-7 mb-1" src={image} alt={`${title} Icon`} />
      {title}
    </button>
  );
};

export default HomeMobileButton;