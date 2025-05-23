import { Link } from "react-router-dom";

const SecondaryBanner = ({ image, imageMobil, zipFile ,baseURL}) => {
  return (
    <div className="pb-3 md:py-3">
      <Link to={zipFile} target={zipFile ? "_blank" : ""} download={zipFile}>
        <img className="hidden md:block" src={`${baseURL}${image}`} alt="" />
        <img className="md:hidden rounded-2xl" src={imageMobil} alt="" />
      </Link>
    </div>
  );
};

export default SecondaryBanner;
