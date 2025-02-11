import { Link, Outlet } from "react-router-dom";
import Navbar from "../components/shared/navbar/Navbar";
import Footer from "../components/shared/footer/Footer";
import { TbUsersGroup } from "react-icons/tb";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineLocalPlay } from "react-icons/md";
import { CiUser } from "react-icons/ci";

// নেভিগেশন ডেটা
const navItems = [
  {
    id: 1,
    to: "",
    icon: <TbUsersGroup className="w-7 h-7" />,
    label: "সুপারিশ",
  },
  {
    id: 2,
    to: "/promotion",
    icon: <MdOutlineLocalPlay className="w-7 h-7" />,
    label: "প্রমোশন",
  },
  {
    id: 3,
    to: "/",
    icon: <IoHomeOutline className="w-7 h-7" />,
    label: "বাড়ি",
  },
  {
    id: 4,
    to: "/profile/deposit",
    icon: <TbUsersGroup className="w-7 h-7" />,
    label: "আমানত",
  },
  {
    id: 5,
    to: "",
    icon: <CiUser className="w-7 h-7" />,
    label: "হিসাব",
  },
];

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <Outlet />
      <Footer />

      <div className="grid grid-cols-5 sticky bottom-0 w-full md:hidden z-50 text-white bg-black rounded-t-2xl">
        {navItems.map((item) => (
          <Link key={item.id} to={item.to}>
            <div className="w-full py-3 px-2 flex flex-col items-center justify-center text-sm gap-0.5">
              {item.icon}
              <p>{item.label}</p>
            </div>
          </Link>
        ))}
      </div>
      {/* <div className="flex sticky bottom-0 w-full md:hidden z-50">
        <Link to={"/registration"} className="w-1/2">
          <p className="p-3 text-base text-center font-semibold text-black bg-[#FFCD03] hover:bg-[#e5be22] transition-all duration-500">
            নিবন্ধন করুন
          </p>
        </Link>
        <Link to={"/login"} className="w-1/2">
          <p className="p-3 text-base text-center font-semibold text-white bg-[#0083FB] hover:bg-[#2f9bff] transition-all duration-500">
            প্রবেশ করুন
          </p>
        </Link>
      </div> */}
    </div>
  );
};

export default MainLayout;
