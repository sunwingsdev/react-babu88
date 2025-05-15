import { Link } from "react-router-dom";
import hotIcon from "@/assets/images/hot-icon.png";
import newIcon from "@/assets/images/game-icon-new.svg";

const GameCard = ({
  gameCardImg,
  badge,
  gameHeading,
  gameText,
  headingCenter,
  demoId,
}) => {
  return (
    <div className="">
      <div className="relative group overflow-hidden ">
        <img
          className="w-full h-28 sm:h-36 object-cover rounded-[20px] lg:rounded-xl"
          src={gameCardImg}
          alt=""
        />
        <div className="absolute w-full h-full top-0 left-0 bg-white opacity-0 z-10 transition-opacity duration-300 group-hover:opacity-70 rounded-[20px] lg:rounded-xl"></div>

        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 translate-y-16 opacity-0 transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
          <Link className="hidden sm:block">
            <img
              className="filter-none grayscale hover:filter "
              src={"https://www.babu88.app/static/svg/play_btn.svg"}
              alt=""
            />
          </Link>
          {demoId && (
            <Link
              to={`/demogame/${demoId}`}
              className="text-white px-2 py-1 rounded-full bg-slate-900 mt-2"
            >
              Demo
            </Link>
          )}
        </div>
        <img
          className="absolute top-1 right-1 w-10"
          src={badge === "new" ? newIcon : hotIcon}
          alt=""
        />
      </div>
      <div className="hidden md:block">
        <h2
          className={`${
            headingCenter ? "text-center" : "text-start"
          } text-lg font-semibold`}
        >
          {gameHeading}
        </h2>
        <p className={`mt-1 text-xs font-semibold`}>{gameText}</p>
      </div>
    </div>
  );
};

export default GameCard;
