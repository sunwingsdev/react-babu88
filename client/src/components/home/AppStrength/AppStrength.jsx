import { useState } from "react";
import { IoClose } from "react-icons/io5";
import image from "@/assets/images/download-app.png";
const AppStrength = () => {
  const [isVisble, setIsVisble] = useState(true);
  return (
    <>
      {isVisble && (
        <div className="md:hidden text-black flex justify-between items-center px-4 py-2">
          <IoClose
            onClick={() => setIsVisble(false)}
            className="text-3xl w-1/8"
          />
          <div className="flex gap-2">
            <img className="size-10" src={image} alt="" />
            <p className="text-[#3a3a3a] leading-4">
              এখনই আমাদের APP সংস্করণ ডাউনলোড করুন!
            </p>
          </div>
          <button className="px-1 py-2 text-base rounded-md text-center text-black bg-[#FFCD03] hover:bg-[#e5be22] transition-all duration-500">
            ডাউনলোড
          </button>
        </div>
      )}
    </>
  );
};

export default AppStrength;
