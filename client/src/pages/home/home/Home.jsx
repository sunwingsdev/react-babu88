import { useState, useEffect } from "react";
import { useToasts } from "react-toast-notifications";
import VideoSlider from "@/components/home/videoSlider/VideoSlider";
import BannerSlider from "../../../components/home/bannerSlider/BannerSlider";
import SecondaryBanner from "../../../components/home/secondaryBanner/SecondaryBanner";
import GameCard from "../../../components/shared/gameCard/GameCard";
import HomeMobileButton from "@/components/home/homeMobilButton/HomeMobileButton";
import { useGetGamesQuery } from "@/redux/features/allApis/gameApi/gameApi";
import hotImage from "@/assets/homepageHot.svg";
import jackpotImage from "@/assets/homeJackpot.svg";
import cricketImage from "@/assets/cricket.svg";
import casinoImage from "@/assets/ld.svg";
import slotImage from "@/assets/rng.svg";
import tableImage from "@/assets/table.svg";
import sbImage from "@/assets/sb.svg";
import fishingImage from "@/assets/fishing.svg";
import crashImage from "@/assets/crash.svg";
import ImageVideoSlider from "@/components/home/ImageVideoSlider/ImageVideoSlider";
import Matches from "@/components/home/Matches/Matches";
import AnimationBanner from "../AnimationBanner/AnimationBanner";

const Home = () => {
  const { addToast } = useToasts();
  const { data: games } = useGetGamesQuery();
  const [activeFilter, setActiveFilter] = useState("hot");
  const [publishImage, setPublishImage] = useState("");
  const [downloadImage, setDownloadImage] = useState("");
  const [downloadApk, setDownloadApk] = useState("");
  const [secondaryBannerImage, setSecondaryBannerImage] = useState("");
  const [referImage, setReferImage] = useState({});
  const [exclusiveImage, setExclusiveImage] = useState("");
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_BASE_API_URL || "http://localhost:5000";

  // Fetch publish, download images, and APK URL
  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
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
        setPublishImage(data.publish || "");
        setDownloadImage(data.download || "");
        setDownloadApk(data.downloadApk || "");
        setSecondaryBannerImage(data.desktop || "");
        setReferImage(data.referImage || {});
        setExclusiveImage(data.exclusiveImage || "");
      } catch (err) {
        console.error("Fetch error:", err);
        setPublishImage("");
        setDownloadImage("");
        setDownloadApk("");
        setSecondaryBannerImage("");
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, [baseURL]);

  // Function to handle APK download
  const handleDownload = () => {
    if (downloadApk) {
      const link = document.createElement("a");
      link.href = `${baseURL}${downloadApk}`;
      link.download = "babu88.apk";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      addToast("No APK file available for download", {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const buttons = [
    { image: jackpotImage, title: "Jackpot", value: "all" },
    { image: hotImage, title: "হট গেমস", value: "hot" },
    { image: cricketImage, title: "ক্রিকেট", value: "cricket" },
    { image: casinoImage, title: "ক্যাসিনো", value: "casino" },
    { image: slotImage, title: "স্লট", value: "slot" },
    { image: tableImage, title: "টেবিল খেলা", value: "table" },
    { image: sbImage, title: "এসবি", value: "sb" },
    { image: fishingImage, title: "মাছ ধরা", value: "fishing" },
    { image: crashImage, title: "ক্র্যাশ", value: "crash" },
  ];

  // Filter games based on activeFilter
  const filteredGames = games?.filter((game) => {
    if (activeFilter === "all") return true; // Show all games when "all" is selected
    if (activeFilter === "hot") return game.badge === "new";
    return game.category === activeFilter;
  });

  useEffect(() => {
    console.log("Active filter changed:", activeFilter);
  }, [activeFilter]);

  return (
    <div>
      <BannerSlider />
      <div className="container mx-auto mt-6 md:mt-0 px-4 sm:px-10 lg:px-24">
        <SecondaryBanner image={secondaryBannerImage} baseURL={baseURL} />

        {/* Mobile Filter Buttons - Only shown on mobile */}
        {window.innerWidth < 768 && (
          <div className="py-2 flex gap-3 overflow-x-auto">
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
        )}

        <AnimationBanner />

        {/* Games Grid */}
        <div className="mt-3 md:mt-0 pb-10 grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 lg:gap-6">
          {filteredGames?.map((game) => (
            <GameCard
              key={game._id}
              gameCardImg={`${import.meta.env.VITE_BASE_API_URL}${game?.image}`}
              badge={game?.badge}
              gameHeading={game?.title}
              gameText={game?.category}
              gameLink={game?.link ? game?.link : null}
              demoId={game?._id}
            />
          ))}
        </div>

        {/* Video Slider */}
        <div className="pb-4 md:pb-0 md:block hidden">
          <VideoSlider />
        </div>

        <div className="pb-4 md:pb-0">
          <Matches />
        </div>

        {/* Image Video Slider */}
        <div className="pb-4 md:pb-0">
          <ImageVideoSlider />
        </div>

        {/* Promotion Section */}
        {publishImage && (
          <h2 className="block md:hidden pt-4 pb-1 text-base font-semibold text-gray-800">
            প্রচার
          </h2>
        )}
        {loading ? (
          <div className="md:hidden w-full h-40 flex items-center justify-center bg-gray-200 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : publishImage ? (
          <img
            className="md:hidden rounded-2xl"
            src={`${baseURL}${publishImage}`}
            alt="Promotion"
          />
        ) : null}

        {/* Desktop Promotion Section */}
        <div className="hidden md:flex flex-col lg:flex-row gap-3 my-3">
          {referImage && (
            <div className="relative w-3/5">
              <img
                className="w-full h-52 object-fill rounded-2xl overflow-hidden"
                src={`${baseURL}${referImage.image}`}
                alt=""
              />
              <div className="text-white absolute top-0 p-4 space-y-3">
                <h2
                  className="text-xl font-semibold"
                  style={{ color: referImage?.referTextColor }}
                >
                  {referImage?.title}
                </h2>
                <p
                  className="text-sm"
                  style={{ color: referImage?.referTextColor }}
                >
                  {referImage?.description}
                </p>
              </div>
              <a
                href={referImage?.link}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-6 left-10 px-4 py-1 text-lg font-bold text-black bg-yellow-400 hover:bg-yellow-600 rounded-full transition-all duration-500"
                style={{
                  backgroundColor: referImage?.btnColor,
                  color: referImage?.btnTextColor,
                }}
              >
                {referImage?.text}
              </a>
            </div>
          )}
          {exclusiveImage && (
            <img
              className="w-2/5 object-fill rounded-2xl overflow-hidden"
              src={`${baseURL}${exclusiveImage}`}
              alt=""
            />
          )}
        </div>

        {/* Download Section */}
        {downloadImage && (
          <h2 className="block md:hidden pt-4 pb-1 text-base font-semibold text-gray-800">
            ডাউনলোড করুন
          </h2>
        )}
        {loading ? (
          <div className="w-full h-40 flex items-center justify-center bg-gray-200 rounded-2xl">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : downloadImage ? (
          <SecondaryBanner
            zipFile={downloadApk}
            image={`${baseURL}${downloadImage}`}
            imageMobil={`${baseURL}${downloadImage}`}
            onClick={handleDownload}
          />
        ) : null}
      </div>
    </div>
  );
};

export default Home;