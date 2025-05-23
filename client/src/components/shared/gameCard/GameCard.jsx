import { Link } from "react-router-dom";
import hotIcon from "@/assets/images/hot-icon.png";
import newIcon from "@/assets/images/game-icon-new.svg";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

const GameCard = ({
  gameCardImg,
  badge,
  gameHeading,
  gameText,
  headingCenter,
  demoId,
}) => {
  const { user, token } = useSelector((state) => state.auth);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Auto-close modal after 3 seconds
  useEffect(() => {
    let timer;
    if (isModalOpen) {
      timer = setTimeout(() => {
        setIsModalOpen(false);
        console.log("Modal auto-closed, isModalOpen set to false");
      }, 3000);
    }
    return () => clearTimeout(timer); // Cleanup timer on unmount or modal close
  }, [isModalOpen]);

  // Function to handle play button click
  const handlePlayClick = (e) => {
    e.preventDefault(); // Prevent default Link behavior
    console.log("Play button clicked", { user, token, isModalOpen }); // Debugging
  };

  return (
    <div
      className=""
      onClick={() => {
        if (!user || !token) {
          setIsModalOpen(true); // Show modal
          console.log("Modal should open, isModalOpen set to true");
        }
      }}
    >
      {/* Game Card Content */}
      <div className="relative group overflow-hidden">
        <img
          className="w-full h-28 sm:h-36 object-cover rounded-[20px] lg:rounded-xl"
          src={gameCardImg}
          alt={gameHeading || "Game Image"}
        />
        <div className="absolute w-full h-full top-0 left-0 bg-white opacity-0 z-10 transition-opacity duration-300 group-hover:opacity-70 rounded-[20px] lg:rounded-xl"></div>

        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 translate-y-16 opacity-0 transition-transform duration-300 group-hover:translate-y-0 group-hover:opacity-100 z-20">
          <Link
            className="hidden sm:block"
            onClick={handlePlayClick} // Handle click
            to={user && token ? "/play" : "#"} // Conditional link destination
          >
            <img
              className="filter-none grayscale hover:filter w-12 h-12"
              src="https://www.babu88.app/static/svg/play_btn.svg"
              alt="Play Button"
            />
          </Link>
          {(user && token) && demoId && (
            <Link
              to={`/demogame/${demoId}`}
              className="text-white px-2 py-1 rounded-full bg-slate-900 mt-2 text-sm font-semibold hover:bg-slate-800 transition-colors"
            >
              Demo
            </Link>
          )}
        </div>
        <img
          className="absolute top-1 right-1 w-7 md:w-10"
          src={badge === "new" ? newIcon : badge === "hot" ? hotIcon : ""}
          alt={badge ? `${badge} badge` : ""}
        />
      </div>
      <div className="hidden md:block">
        <h2
          className={`${
            headingCenter ? "text-center" : "text-start"
          } text-lg font-semibold text-gray-800`}
        >
          {gameHeading}
        </h2>
        <p className="mt-1 text-xs font-semibold text-gray-600">{gameText}</p>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 transition-opacity duration-300">
          <div className="bg-slate-900 rounded-[20px] p-6 w-11/12 max-w-md shadow-lg">
            <p className="text-gray-300 mb-6">Please login</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameCard;