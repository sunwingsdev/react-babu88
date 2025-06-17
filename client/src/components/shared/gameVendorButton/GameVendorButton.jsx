import { useSelector } from "react-redux";

const GameVendorButton = ({ gameVendorImg, gameVendorText, isFirst, onClick }) => {


  const { mainColor, backgroundColor } = useSelector((state) => state.themeColor);

  return (
    <div>
      <button onClick={() => onClick(gameVendorText)} className="w-full mx-auto md:p-2 text-xs lg:text-sm font-semibold  cursor-pointer md:border-2 md:border-[#FFCD03] md:rounded-full transition-all duration-500">
        <div className="flex gap-0 md:gap-1 flex-col md:flex-row justify-center items-center">
          {gameVendorImg && (
            <div className="size-14 md:size-5 p-2 md:p-0 rounded-lg md:rounded-none bg-slate-200 hover:bg-gray-700 md:hover:bg-inherit md:bg-inherit">
              <img className="w-full" src={gameVendorImg} alt="" />
            </div>
          )}
          <p
            className={`${
              isFirst &&
              `border-2 md:border-none rounded-lg md:rounded-lg border-${mainColor} hover:bg-${backgroundColor} md:hover:bg-inherit md:border-${mainColor} p-[18px] md:p-0`
            }`}
          >
            {gameVendorText}
          </p>
        </div>
      </button>
    </div>
  );
};

export default GameVendorButton;


