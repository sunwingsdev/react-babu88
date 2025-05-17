import { useState } from "react";
import VideoSlider from "@/components/home/videoSlider/VideoSlider";
import BannerSlider from "../../../components/home/bannerSlider/BannerSlider";
import SecondaryBanner from "../../../components/home/secondaryBanner/SecondaryBanner";
import GameCard from "../../../components/shared/gameCard/GameCard";
import HomeMobileButton from "@/components/home/homeMobilButton/HomeMobileButton";
import { useGetGamesQuery } from "@/redux/features/allApis/gameApi/gameApi";
import hotImage from "@/assets/homepageHot.svg";
import cricketImage from "@/assets/cricket.svg";
import casinoImage from "@/assets/ld.svg";
import slotImage from "@/assets/rng.svg";
import tableImage from "@/assets/table.svg";
import sbImage from "@/assets/sb.svg";
import fishingImage from "@/assets/fishing.svg";
import crashImage from "@/assets/crash.svg";
import ImageVideoSlider from "@/components/home/ImageVideoSlider/ImageVideoSlider";
import mobileBdtImage from "@/assets/mobile_BDT_bd.jpg";
import referBannerImage from "@/assets/refer_banner.jpg";
import mobileBannerImage from "@/assets/mobile.jpg";
import desktopBannerImage from "@/assets/desktop.jpg";
import bettingPassImage from "@/assets/betting-pass.jpg";
import bannerImage from "@/assets/register_banner.jpg";
import Matches from "@/components/home/Matches/Matches";

const Home = () => {
  const { data: games } = useGetGamesQuery();
  const [activeFilter, setActiveFilter] = useState("hot");

  const buttons = [
    {
      image: hotImage,
      title: "হট গেমস",
      value: "hot",
    },
    {
      image: cricketImage,
      title: "ক্রিকেট",
      value: "cricket",
    },
    {
      image: casinoImage,
      title: "ক্যাসিনো",
      value: "casino",
    },
    {
      image: slotImage,
      title: "স্লট",
      value: "slot",
    },
    {
      image: tableImage,
      title: "টেবিল খেলা",
      value: "table",
    },
    {
      image: sbImage,
      title: "এসবি",
      value: "sb",
    },
    {
      image: fishingImage,
      title: "মাছ ধরা",
      value: "fishing",
    },
    {
      image: crashImage,
      title: "ক্র্যাশ",
      value: "crash",
    },
  ];

  const filteredGames = games?.filter((game) => {
    if (activeFilter === "hot") {
      return game.badge === "hot";
    } else {
      return game.category === activeFilter;
    }
  });

  return (
    <div>
      <BannerSlider />
      <div className="container mx-auto mt-6 md:mt-0 px-4 sm:px-10 lg:px-24">
        <SecondaryBanner image={bannerImage} />

        {/* Mobile Filter Buttons - Only shown on mobile */}
        <div className="md:hidden py-2 flex gap-3 overflow-x-auto">
          {buttons.map((button) => (
            <HomeMobileButton
              key={button.value}
              image={button.image}
              title={button.title}
              isActive={activeFilter === button.value}
              onClick={() => setActiveFilter(button.value)}
            />
          ))}
        </div>

        {/* Games Grid */}
        <div className="mt-3 md:mt-0 pb-10 grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 lg:gap-6">
          {/* Show filtered games on mobile, all games on desktop/tablet */}
          {(window.innerWidth < 768 ? filteredGames : games)?.map((game) => (
            <GameCard
              key={game._id}
              gameCardImg={`${import.meta.env.VITE_BASE_API_URL}${game?.image}`}
              badge={game?.badge}
              gameHeading={game?.title}
              gameText={"EVOLUTION GAMING"}
              demoId={game?._id}
            />
          ))}
        </div>

        {/* Video Slider */}
        <div className="pb-4 md:pb-0">
          <VideoSlider />
        </div>

        <div className="pb-4 md:pb-0">
          <Matches />
        </div>
        {/* Video Slider */}
        <div className="pb-4 md:pb-0">
          <ImageVideoSlider />
        </div>

        {/* Promotion Section */}
        <h2 className="block md:hidden pt-4 pb-1 text-base font-semibold text-gray-800">
          প্রচার
        </h2>
        <img className="md:hidden rounded-2xl" src={mobileBdtImage} alt="" />

        {/* Desktop Promotion Section */}
        <div className="hidden md:flex flex-col lg:flex-row gap-3 my-3">
          <div className="relative w-3/5">
            <img
              className="w-full h-52 object-fill rounded-2xl overflow-hidden"
              src={referBannerImage}
              alt=""
            />
            <div className="text-white absolute top-0 p-4 space-y-3 ">
              <h2 className="text-xl font-semibold">
                Refer friends and start earning
              </h2>
              <p className="text-sm">
                The No.1 friend referral program in Bangladesh is here! Earn
                free ৳500 when your refer a friend and also earn lifetime
                commission of up to 2% for every deposit your friend makes!
              </p>
            </div>
            <button className="absolute bottom-6 left-10 px-4 py-1 text-lg font-bold text-black bg-yellow-400 hover:bg-yellow-600 rounded-full transition-all duration-500">
              Refer Now
            </button>
          </div>
          <img
            className="w-2/5 object-fill rounded-2xl overflow-hidden"
            src={bettingPassImage}
            alt=""
          />
        </div>

        {/* Download Section */}
        <h2 className="block md:hidden pt-4 pb-1 text-base font-semibold text-gray-800">
          ডাউনলোড করুন
        </h2>
        <SecondaryBanner
          zipFile={"/babu88.apk"}
          image={desktopBannerImage}
          imageMobil={mobileBannerImage}
        />
      </div>
    </div>
  );
};

export default Home;
