import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const HomeMobileButton = ({ image, title, isActive, onClick }) => {
  const { mainBackgroundTextColor , mainBackgroundColor , secondaryColor } = useSelector((state) => state.themeColor);
  const [svgContent, setSvgContent] = useState("");

  // Fetch SVG content as string
  useEffect(() => {
    fetch(image)
      .then((res) => res.text())
      .then((data) => {
        // Replace all fill colors inside SVG with desired color
        const color = isActive ?   mainBackgroundColor :   mainBackgroundTextColor;
        const coloredSVG = data.replace(/fill=".*?"/g, `fill="${color}"`);
        setSvgContent(coloredSVG);
      });
  }, [image, isActive]);


  return (
    <button
      onClick={onClick}
      className={`min-w-[74px] inline-flex flex-col gap-1 items-center justify-center whitespace-nowrap p-2 text-xs font-medium rounded-sm transition-all duration-300 mobile-button`}
      style={{
        backgroundColor: isActive ? secondaryColor : mainBackgroundColor,
        color:  isActive ?   mainBackgroundColor :   mainBackgroundTextColor,
      }}
    >
     <style>
  {`
    .mobile-button:hover {
      background-color: ${"red"};
    }
    .svg-icon svg {
      width: 2rem;
      height: 2rem;
    }
  `}
</style>


     <div
  className="svg-icon w-7 mb-1"
  dangerouslySetInnerHTML={{ __html: svgContent }}
/>


      {title}
    </button>
  );
};

export default HomeMobileButton;
