import Banner from "@/components/shared/banner/Banner";
import GameCard from "@/components/shared/gameCard/GameCard";
import RouteChange from "@/components/shared/routeChange/RouteChange";
import { useGetGamesQuery } from "@/redux/features/allApis/gameApi/gameApi";
import { useGetCategoriesQuery } from "@/redux/features/allApis/categoriesApi/categoriesApi";
import { useSelector } from "react-redux";
import { useState } from "react";

const Cricket = () => {
  const { data: games = [], isLoading: isGamesLoading, isError: isGamesError } = useGetGamesQuery();
  const { data: subcategories = [], isLoading: isSubcategoriesLoading, isError: isSubcategoriesError } = useGetCategoriesQuery();

  // State to track selected subcategory
  const [selectedSubcategory, setSelectedSubcategory] = useState("all");

  // Filter cricket subcategories
  const cricketSubcategories = subcategories.filter((sub) => sub.category === "cricket");

  // Create buttons array for GameVendorList with "All" button
  const buttons = [
    {
      image: null, // No image for "All" button
      text: "সব",
    },
    ...cricketSubcategories.map((sub) => ({
      image: `${import.meta.env.VITE_BASE_API_URL}${sub?.iconImage}`,
      text: sub.title,
    })),
  ];

  // Filter cricket games based on selected subcategory
  const cricketGames = games.filter((game) => {
    if (selectedSubcategory === "all") {
      return game.category === "cricket";
    }
    return game.category === "cricket" && game.subcategory === selectedSubcategory;
  });

  // Handle button click
  const handleButtonClick = (subcategory) => {
    if (subcategory === "সব") {
      setSelectedSubcategory("all");
    } else {
      setSelectedSubcategory(subcategory);
    }
  };

  // Inline GameVendorButton component
  const GameVendorButton = ({ gameVendorImg, gameVendorText, onClick }) => {
    const { mainColor , backgroundColor } = useSelector((state) => state.themeColor);
    const isSelected = selectedSubcategory === gameVendorText || (gameVendorText === "সব" && selectedSubcategory === "all");

    return (
      <div>
        <button
          onClick={() => onClick(gameVendorText)}
          className="w-full mx-auto md:p-2 text-xs lg:text-sm font-semibold cursor-pointer md:border-2 md:rounded-full transition-all duration-500"
          style={{
            borderColor: isSelected ? mainColor : backgroundColor,
            backgroundColor: isSelected ? backgroundColor : mainColor,
            color: isSelected ? mainColor : backgroundColor
          }}

          

        >
          <div className="flex gap-0 md:gap-1 flex-col md:flex-row justify-center items-center">
            {gameVendorImg && (
              <div className="size-14 md:size-5 p-2 md:p-0 rounded-lg md:rounded-none bg-slate-200 hover:bg-gray-700 md:hover:bg-inherit md:bg-inherit">
                <img className="w-full" src={gameVendorImg} alt="" />
              </div>
            )}
            <p>{gameVendorText}</p>
          </div>
        </button>
      </div>
    );
  };

  // Inline GameVendorList component
  const GameVendorList = ({ buttons }) => {
    return (
      <div>
        {/* button */}
        <div className="md:container md:mx-auto px-0 md:px-4 sm:px-10 lg:px-24 mt-2 md:mt-6">
          <div className="p-2 lg:p-4 bg-slate-100 rounded-lg">
            <div className="flex md:grid xl:grid-cols-6 grid-cols-4 gap-3 md:gap-4 overflow-x-auto md:overflow-visible">
              {buttons?.map((button, index) => (
                <GameVendorButton
                  key={index}
                  gameVendorImg={button.image}
                  gameVendorText={button.text}
                  onClick={handleButtonClick}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Banner img */}
      <Banner
        B_image={
          "https://jiliwin.9terawolf.com/images/babu/game_banner/cricket_new.jpg"
        }
        B_heading={"ক্রিকেট"}
        B_semiText={`${
          import.meta.env.VITE_SITE_NAME
        } হল ক্রিকেট বেটিং এর জন্য এক নম্বর চয়েস`}
        B_text={
          "সমস্ত বড় ক্রিকেট লিগের জন্য সেরা প্রতিকূলতার সাথে লাইভ বেটিং!"
        }
      />
      {/* Mobile slide menu */}
      <RouteChange text={"ক্রিকেট"} />
      {/* Subcategories */}
      {isSubcategoriesLoading ? (
        <div className="text-center text-gray-500">Loading subcategories...</div>
      ) : isSubcategoriesError ? (
        <div className="text-center text-red-500">Error loading subcategories</div>
      ) : buttons.length === 1 ? ( // Only "All" button exists
        <div className="text-center text-gray-500">No subcategories available</div>
      ) : (
        <GameVendorList buttons={buttons} />
      )}
      {/* Games */}
      <div className="container mx-auto px-4 sm:px-10 lg:px-24">
        <div className="mt-10 pb-10">
          {isGamesLoading ? (
            <div className="text-center text-gray-500">Loading games...</div>
          ) : isGamesError ? (
            <div className="text-center text-red-500">Error loading games</div>
          ) : cricketGames.length === 0 ? (
            <div className="text-center text-gray-500">No games available</div>
          ) : (
            <div className="grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 lg:gap-6">
              {cricketGames.map((game) => (
                <GameCard
                  key={game._id}
                  gameCardImg={`${import.meta.env.VITE_BASE_API_URL}${game.image}`}
                  gameHot={
                    game.badge
                      ? game.badge === "hot"
                        ? "https://www.babu88.app/static/image/other/hot-icon.png"
                        : "https://www.babu88.app/static/svg/game-icon-new.svg"
                      : null
                  }
                  gameHeading={game.title}
                  headingCenter={true}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cricket;