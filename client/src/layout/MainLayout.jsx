import { Link, Outlet, useLocation } from "react-router-dom";
import Navbar from "../components/shared/navbar/Navbar";
import Footer from "../components/shared/footer/Footer";
import { TbUsersGroup } from "react-icons/tb";
import { IoHomeOutline } from "react-icons/io5";
import { MdOutlineLocalPlay } from "react-icons/md";
import { CiUser } from "react-icons/ci";
import { useSelector } from "react-redux";
import AppStrength from "@/components/home/AppStrength/AppStrength";
import { useEffect, useState } from "react";

// Navigation data
const navItems = [
  {
    id: 1,
    to: "/referral",
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
    to: "/profile/profileAccount",
    icon: <CiUser className="w-7 h-7" />,
    label: "হিসাব",
  },
];

const MainLayout = () => {
  const { user, token } = useSelector((state) => state.auth);
  const { mainColor, backgroundColor } = useSelector((state) => state.themeColor);
  const location = useLocation();

  const [path, setPath] = useState("");

  // Utility to darken a hex color for hover effect
  const darkenColor = (hex, amount) => {
    let color = hex.replace("#", "");
    const num = parseInt(color, 16);
    const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
    const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * amount));
    const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  // Fallback colors if not loaded or error occurs
  const bannerBgColor = backgroundColor || "#BFDBFE"; // Default to blue-100 if backgroundColor is not set
  const buttonBgColor = mainColor || "#FFCD03"; // Default to original button color if mainColor is not set
  let buttonHoverBgColor = mainColor ? darkenColor(mainColor, 0.1) : "#e5be22"; // Darken mainColor for hover or use original hover

  useEffect(() => {
    console.log("router: ", location.pathname);
    setPath(location.pathname);
  }, [location]);

  return (
    <div>
      <style>
        {`
          .register-button:hover {
            background-color: ${buttonHoverBgColor};
          }
          .login-button:hover {
            background-color: ${buttonHoverBgColor};
          }
          .nav-item:hover {
            background-color: ${darkenColor(bannerBgColor, 0.1)};
          }
        `}
      </style>
      <AppStrength />
      <Navbar />
      <Outlet />
      <Footer />

      {!user && !token ? (
        <div className="flex sticky bottom-0 w-full md:hidden z-50">
          <Link to={"/register"} className="w-1/2">
            <p
              className="p-3 text-base text-center font-semibold text-black register-button"
              style={{ backgroundColor: buttonBgColor }}
            >
              নিবন্ধন করুন
            </p>
          </Link>
          <Link to={"/login"} className="w-1/2">
            <p
              className="p-3 text-base text-center font-semibold text-white login-button"
              style={{ backgroundColor: buttonBgColor }}
            >
              প্রবেশ করুন
            </p>
          </Link>
        </div>
      ) : (
        <div
          className="grid grid-cols-5 sticky bottom-0 w-full md:hidden z-50 text-white rounded-t-2xl"
          style={{ backgroundColor: bannerBgColor }}
        >
          {navItems.map((item) => (
            <Link key={item.id} to={item.to}>
              <div className="w-full py-3 px-2 flex flex-col items-center justify-center text-sm gap-0.5 nav-item">
                {(path === item.to ||
                  (item.to === "/profile/deposit" &&
                    path.includes("/profile/deposit")) ||
                  (item.to === "/profile/deposit" &&
                    path.includes("/profile/withdrawal"))) ? (
                  <div style={{ color: buttonBgColor }}>{item.icon}</div>
                ) : (
                  item.icon
                )}
                <p>{item.label}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default MainLayout;