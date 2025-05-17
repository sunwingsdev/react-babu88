// import FavoriteSelectionSection from "../../components/dashboard/FavoriteSelectionSection";
// import FavoriteUploadSection from "../../components/dashboard/FavoriteUploadSection";
// import FeaturedSelectionSection from "../../components/dashboard/FeaturedSelectionSection";
// import FeaturedUploadSection from "../../components/dashboard/FeaturedUploadSection";
import SliderUploadSection from "@/components/dashboard/SliderUploadSection";
import LogoSelection from "../../components/dashboard/LogoSelection";
import LogoUpload from "../../components/dashboard/LogoUpload";
import SliderSelectionSection from "@/components/dashboard/SliderSelectionSection";
import NoticeUploadSection from "@/components/dashboard/NoticeUploadSection";
import NoticeSelectionSection from "@/components/dashboard/NoticeSelectionSection";
import AddFeatures from "./AddFeatures";
// import NoticeSelectionSection from "../../components/dashboard/NoticeSelectionSection";
// import NoticeUploadSection from "../../components/dashboard/NoticeUploadSection";
// import SliderSelectionSection from "../../components/dashboard/SliderSelectionSection";
// import SliderUploadSection from "../../components/dashboard/SliderUploadSection";

const HomeControl = () => {
  return (
    <div className="">
      <LogoUpload />
      <LogoSelection />
      <SliderUploadSection />
      <SliderSelectionSection />
      
      {/* <FavoriteUploadSection />
      <FavoriteSelectionSection />
      <FeaturedUploadSection />
      <FeaturedSelectionSection /> */}
      <NoticeUploadSection />
      <NoticeSelectionSection />
      <AddFeatures />
    </div>
  );
};

export default HomeControl;
