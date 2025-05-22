import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaCaretDown, FaPlus, FaUser } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { TbCurrencyTaka } from "react-icons/tb";
import { IoHome, IoMenuOutline } from "react-icons/io5";
import { useEffect, useState } from "react";
import Modal from "../modal/Modal";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetClose,
} from "@/components/ui/sheet"; // Shadcn sheet
import MegaMenu from "../megaMenu/MegaMenu";
import { useDispatch, useSelector } from "react-redux";
import { RiLogoutCircleRFill } from "react-icons/ri";
import { useToasts } from "react-toast-notifications";
import { logout } from "@/redux/slices/authSlice";
import { useGetHomeControlsQuery } from "@/redux/features/allApis/homeControlApi/homeControlApi";
import { useLazyGetUserByIdQuery } from "@/redux/features/allApis/usersApi/usersApi";
import { useGetCategoriesQuery } from "@/redux/features/allApis/categoriesApi/categoriesApi";
import hotIcon from "@/assets/images/hot-icon.png";
import promotion from "@/assets/icons/promotion.svg";
import rewards from "@/assets/icons/rewards.svg";
import referAndEarn from "@/assets/icons/referAndEarn.svg";
import bettingPass from "@/assets/icons/bettingPass.svg";
import bpass_ipl_icon from "@/assets/icons/bpass_ipl_icon.svg";
import agentAff from "@/assets/icons/agentAff.svg";
import cricket from "@/assets/icons/cricket.svg";
import ld from "@/assets/icons/ld.svg";
import rng from "@/assets/icons/rng.svg";
import table from "@/assets/icons/table.svg";
import sb from "@/assets/icons/sb.svg";
import fishing from "@/assets/icons/fishing.svg";
import crash from "@/assets/icons/crash.svg";
import fastgames from "@/assets/icons/fastgames.svg";
import language from "@/assets/icons/language.svg";
import faq from "@/assets/icons/faq.svg";
import liveChat from "@/assets/icons/liveChat.svg";
import downloadApp from "@/assets/icons/downloadApp.svg";
import logoutImage from "@/assets/icons/logout.svg";
import bdFlag from "@/assets/icons/bdFlag.png";
import inrFlag from "@/assets/icons/INR.svg";
import nprFlag from "@/assets/icons/NPR.svg";

const data = [
  {
    id: 1,
    image: promotion,
    title: "প্রমোশন",
    route: "/promotion",
    badge: "",
  },
  {
    id: 2,
    image: rewards,
    title: "পুরস্কার",
    route: "/profile/rewards",
    badge: "new",
  },
  {
    id: 3,
    image: referAndEarn,
    title: "রেফারেল প্রোগ্রাম",
    route: "/profile/rewards",
    badge: "hot",
  },
  {
    id: 4,
    image: bettingPass,
    title: "বেটিং পাস",
    route: "/profile/rewards",
    badge: "hot",
  },
  {
    id: 5,
    image: bpass_ipl_icon,
    title: "IPL 2025 বেটিং পাস",
    route: "/profile/rewards",
    badge: "hot",
  },
  {
    id: 6,
    image: agentAff,
    title: "অ্যাফিলিয়েট",
    route: "/profile/rewards",
    badge: "",
  },
];

const gamesData = [
  {
    id: 1,
<<<<<<< HEAD
    image: cricket,
    title: " ক্রিকেট",
=======
    image: "https://www.babu88.app/static/svg/mobileMenu/cricket.svg",
    title: "ক্রিকেট",
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
    route: "/cricket",
    badge: "",
  },
  {
    id: 2,
<<<<<<< HEAD
    image: ld,
    title: " ক্যাসিনো",
    route: "/cricket",
=======
    image: "https://www.babu88.app/static/svg/mobileMenu/ld.svg",
    title: "ক্যাসিনো",
    route: "/casino",
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
    badge: "",
  },
  {
    id: 3,
<<<<<<< HEAD
    image: rng,
    title: " স্লট গেম",
    route: "/cricket",
=======
    image: "https://www.babu88.app/static/svg/mobileMenu/rng.svg",
    title: "স্লট গেম",
    route: "/slot",
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
    badge: "",
  },
  {
    id: 4,
<<<<<<< HEAD
    image: table,
    title: " টেবিল গেম",
    route: "/cricket",
=======
    image: "https://www.babu88.app/static/svg/mobileMenu/table.svg",
    title: "টেবিল গেম",
    route: "/table-games",
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
    badge: "",
  },
  {
    id: 5,
    image: sb,
    title: "খেলার বই",
    route: "/sports-book",
    badge: "",
  },
  {
    id: 6,
    image: fishing,
    title: "মাছ ধরা",
    route: "/fishing",
    badge: "",
  },
  {
    id: 7,
    image: crash,
    title: "ক্র্যাশ",
    route: "/crash",
    badge: "new",
  },
  {
    id: 8,
    image: fastgames,
    title: "দ্রুতগতির গেমস",
    route: "/cricket",
    badge: "",
  },
];

const Navbar = () => {
  const { data: homeControls } = useGetHomeControlsQuery();
  const { data: categories = [], isLoading: isCategoriesLoading } = useGetCategoriesQuery();
  const { user, token } = useSelector((state) => state.auth);
  const { mainColor, backgroundColor } = useSelector(
    (state) => state.themeColor
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  // Fallback colors
  const navBackgroundColor = backgroundColor || "#333333";
  const primaryColor = mainColor || "#FFCD03";

  // Utility to darken a hex color for hover effect
  const _darkenColor = (hex, amount) => {
    let color = hex.replace("#", "");
    const num = parseInt(color, 16);
    const r = Math.max(0, (num >> 16) - Math.round(255 * amount));
    const g = Math.max(0, ((num >> 8) & 0x00ff) - Math.round(255 * amount));
    const b = Math.max(0, (num & 0x0000ff) - Math.round(255 * amount));
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  const darkenColor = (hex, amount) => _darkenColor(hex, amount);
  const primaryHoverColor = mainColor ? darkenColor(mainColor, 0.1) : "#e5be22";

<<<<<<< HEAD
  // Cricket
  const megaMenuCricket = [
    {
      route: "/cricket",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/cricket/betswiz_new.png",
    },
    {
      route: "/cricket",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/cricket/sap_new.png",
    },
  ];
  // Casino
  const megaMenuCasino = [
    {
      route: "/casino",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/ld/evo_new.png",
    },
    {
      route: "/casino",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/ld/pp_new.png",
    },
    {
      route: "/casino",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/ld/sexy_v2_new.png",
    },
    {
      route: "/casino",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/ld/royal_new.png",
    },
    {
      route: "/casino",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/ld/ezugi_new.png",
    },
    {
      route: "/casino",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/ld/pt_new.png",
    },
    {
      route: "/casino",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/ld/aura_new.png",
    },
  ];
  // Slot
  const megaMenuSlot = [
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/jili_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/pp_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/haba_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/pg_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/spg_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/pt_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/rt_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/png_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/smart_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/jdb_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/one_new.png",
    },
    {
      route: "/slot",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/rng/netent_new.png",
    },
    {
      route: "/slot",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/rng/nolimit_new.png",
    },
    {
      route: "/slot",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/rng/relax_new.png",
    },
    {
      route: "/slot",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/rng/booongo_new.png",
    },
  ];
  // Table-games
  const megaMenuTable = [
    {
      route: "/table-games",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/table/jili_new.png",
    },
    {
      route: "/table-games",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/table/sexy_v2_new.png",
    },
    {
      route: "/table-games",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/table/spg_new.png",
    },
  ];
  // Sport
  const megaMenuSportBook = [
    {
      route: "/sports-book",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/sb/ibc_new.png",
    },
  ];
  // Fishing
  const megaMenuFishing = [
    {
      route: "/fishing",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/fishing/jili_new.png",
    },
    {
      route: "/fishing",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/fishing/spg_new.png",
    },
  ];
  // Crash
  const megaMenuCrash = [
    {
      route: "/crash",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/crash/aviatrix_new.png",
    },
    {
      route: "/crash",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/crash/jili_new.png",
    },
    {
      route: "/crash",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/crash/pp_new.png",
    },
    {
      route: "/crash",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/crash/spribe_new.png",
    },
    {
      route: "/crash",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/crash/smart_new.png",
    },
    {
      route: "/crash",
      image:
        "https://jiliwin.9terawolf.com/images/babu/menu/crash/bslt_new.png",
    },
  ];
=======
  // Dynamic mega menu data
  const getMegaMenuData = (category) => {
    return categories
      .filter((cat) => cat.category === category)
      .map((cat) => ({
        route: category === "sb" ? "/sports-book" : category === "table" ? "/table-games" : `/${category}`,
        image: `${import.meta.env.VITE_BASE_API_URL}${cat?.image}`,
        title: cat.title,
      }));
  };

  const megaMenuData = {
    cricket:getMegaMenuData("cricket"), // No data in provided MongoDB for cricket
    casino: getMegaMenuData("casino"),
    slot: getMegaMenuData("slot"), // No data in provided MongoDB for slot
    table: getMegaMenuData("table"), // No data in provided MongoDB for table
    sports_book: getMegaMenuData("sb"),
    fishing: getMegaMenuData("fishing"), // No data in provided MongoDB for fishing
    crash: getMegaMenuData("casino"), // No data in provided MongoDB for crash
  };
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390

  const modalData = [
    {
      id: 1,
      currency: "BDT",
      currencySymbol: "৳",
      flagSrc: bdFlag,
      languages: ["ENGLISH", "BENGALI"],
    },
    {
      id: 2,
      currency: "INR",
      currencySymbol: "₹",
      flagSrc: inrFlag,
      languages: ["ENGLISH", "HINDI"],
    },
    {
      id: 3,
      currency: "NPR",
      currencySymbol: "₨",
      flagSrc: nprFlag,
      languages: ["ENGLISH", "NEPALESE"],
    },
  ];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isCasinoHovered, setIsCasinoHovered] = useState(false);
  const [isSlotHovered, setIsSlotHovered] = useState(false);
  const [isTableHovered, setIsTableHovered] = useState(false);
  const [isSportHovered, setIsSportHovered] = useState(false);
  const [isFishingHovered, setIsFishingHovered] = useState(false);
  const [isCrashHovered, setIsCrashHovered] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    addToast("Logout successful", {
      appearance: "success",
      autoDismiss: true,
    });
    navigate("/");
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const logo = homeControls?.find(
    (control) => control.category === "logo" && control.isSelected
  );

  const [triggerGetUserById, { data: userData, isLoading, isError }] =
    useLazyGetUserByIdQuery();

  const getUserDataAgain = (props) => {
    if (props) {
      triggerGetUserById(props);
    }
  };

  useEffect(() => {
    if (user) {
      triggerGetUserById(user._id);
    }
  }, [user, triggerGetUserById]);

  return (
    <div className="z-20">
      <style>
        {`
          .nav-link:hover {
            color: ${mainColor};
            background-color: #424242;
            border-bottom: 4px solid ${mainColor};
          }
          .login-button:hover {
            background-color: ${darkenColor(mainColor, 0.1)};
          }
          .signup-button:hover {
            background-color: #2f9bff;
          }
          .language-button:hover {
            background-color: #c2c2c2;
          }
          .profile-button:hover,
          .notification-button:hover,
          .logout-button:hover {
            background-color: ${darkenColor(mainColor, 0.1)};
          }
          .deposit-button:hover {
            background-color: ${mainColor};
          }
        `}
      </style>
      {/* Start top navbar */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Mobile menu icon */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button className="ml-auto">
                  <IoMenuOutline size={30} />
                </button>
              </SheetTrigger>
<<<<<<< HEAD

=======
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
              <SheetContent
                className="bg-slate-50 text-gray-600 w-64 p-2"
                side="left"
              >
                <SheetClose asChild className="border-b-2 pb-2">
                  <div className="w-40">
                    <Link to={"/"}>
                      <img
                        src={`${import.meta.env.VITE_BASE_API_URL}${
                          logo?.image
                        }`}
                        alt="Logo"
                      />
                    </Link>
                  </div>
                </SheetClose>
                <ul className="space-y-6 overflow-y-auto h-[92%]">
                  {data?.map((item) => (
                    <SheetClose key={item.id} asChild>
                      <Link to={item.route}>
                        <li className="flex items-center justify-start gap-3 mt-4 text-xs font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
                          <img
                            className="w-6"
                            src={item.image}
                            alt={item.title}
                          />
                          <p className="text-black">{item.title}</p>
                          {item?.badge &&
                            (item?.badge === "hot" ? (
                              <div className="w-8 animate-pulse">
                                <img
                                  className="w-full"
                                  src={hotIcon}
                                  alt="Hot"
                                />
                              </div>
                            ) : (
                              <button className="animate-pulse rounded-full w-8 bg-[#04B22B] text-white">
                                new
                              </button>
                            ))}
                        </li>
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="border-b-2 pb-2">
                    <p className="text-sm font-semibold">Games</p>
                  </div>
                  
                  {gamesData?.map((item) => (
                    <SheetClose key={item.id} asChild>
                      <Link to={item.route}>
                        <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
                          <img
                            className="w-6"
                            src={item.image}
                            alt={item.title}
                          />
                          <p className="text-black">{item.title}</p>
                          {item?.badge && (
                            <button className="animate-pulse rounded-full w-10 py-1 bg-[#04B22B] text-white">
                              new
                            </button>
                          )}
                        </li>
                      </Link>
                    </SheetClose>
                  ))}
                  <div className="border-b-2 pb-2">
                    <p className="text-sm font-semibold">Others</p>
                  </div>
                  <SheetClose asChild>
                    <Link to={"/"}>
                      <li
                        onClick={handleModalOpen}
                        className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg"
                      >
<<<<<<< HEAD
                        <img className="w-4" src={language} alt="Language" />
                        <p className="text-black"> ভাষা</p>
=======
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/language.svg"
                          alt="Language"
                        />
                        <p className="text-black">ভাষা</p>
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                      </li>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to={"/faq"}>
                      <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
<<<<<<< HEAD
                        <img className="w-4" src={faq} alt="FAQ" />
                        <p className="text-black">
                          {" "}
                          প্রায়শই জিজ্ঞাসিত প্রশ্নাবল
                        </p>
=======
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/faq.svg"
                          alt="FAQ"
                        />
                        <p className="text-black">প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী</p>
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                      </li>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to={"/faq"}>
                      <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
<<<<<<< HEAD
                        <img className="w-4" src={liveChat} alt="Live Chat" />
                        <p className="text-black"> সরাসরি কথোপকথন</p>
=======
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/liveChat.svg"
                          alt="Live Chat"
                        />
                        <p className="text-black">সরাসরি কথোপকথন</p>
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                      </li>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to={"./babu88.apk"} target={"_blank"} download>
                      <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
                        <img
                          className="w-4"
                          src={downloadApp}
                          alt="Download App"
                        />
                        <p className="text-black">ডাউনলোড করুন</p>
                      </li>
                    </Link>
                  </SheetClose>
                  {user && (
                    <SheetClose asChild>
                      <li
                        onClick={handleLogout}
                        className="flex gap-4 mt-10 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg"
                      >
                        <img className="w-4" src={logoutImage} alt="Logout" />
                        <p className="text-black">প্রস্থান</p>
                      </li>
                    </SheetClose>
                  )}
                </ul>
              </SheetContent>
            </Sheet>
          </div>

          {/* Logo */}
          <div className="w-52 sm:w-56 md:w-72">
            <Link to={"/"}>
              <img
                src={`${import.meta.env.VITE_BASE_API_URL}${logo?.image}`}
                alt="Logo"
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Dashboard */}
            {token && user ? (
              <div className="md:flex justify-center items-center gap-3 hidden">
                <div className="flex justify-center items-center gap-2 lg:gap-3">
                  <p className="text-lg font-bold">{user?.username}</p>
                  <Link to={"/profile"}>
<<<<<<< HEAD
                    <div
                      className="flex justify-center items-center p-3 text-base lg:text-xl profile-button rounded-full"
                      style={{
                        backgroundColor: backgroundColor,
                        color: mainColor,
                      }}
                    >
=======
                    <div className="flex justify-center items-center p-3 text-base lg:text-xl profile-button rounded-full" style={{ backgroundColor: backgroundColor, color: mainColor }}>
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                      <FaUser />
                    </div>
                  </Link>
                  <Link to={"/profile/inbox"} className="relative">
<<<<<<< HEAD
                    <div
                      className="flex justify-center items-center p-2.5 text-xl lg:text-2xl notification-button rounded-full"
                      style={{
                        backgroundColor: backgroundColor,
                        color: mainColor,
                      }}
                    >
=======
                    <div className="flex justify-center items-center p-2.5 text-xl lg:text-2xl notification-button rounded-full" style={{ backgroundColor: backgroundColor, color: mainColor }}>
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                      <IoMdNotifications />
                    </div>
                    <div className="absolute -top-1 -right-1 flex justify-center items-center w-5 h-5 text-xs text-white bg-blue-500 rounded-full">
                      58
                    </div>
                  </Link>
                  <div>
                    <button
                      onClick={handleLogout}
                      className="flex justify-center items-center p-2.5 text-xl lg:text-2xl logout-button rounded-full"
<<<<<<< HEAD
                      style={{
                        backgroundColor: backgroundColor,
                        color: mainColor,
                      }}
=======
                      style={{ backgroundColor: backgroundColor, color: mainColor }}
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                    >
                      <RiLogoutCircleRFill />
                    </button>
                  </div>
                  <div className="w-1 h-10 border-r border-gray-400"></div>
                </div>
                <div className="flex gap-2 items-center pl-4 rounded-full bg-gray-200">
                  <Link>
                    <div
                      className="flex items-center text-xl lg:text-2xl"
                      onClick={() => user && getUserDataAgain(user._id)}
                    >
                      <TbCurrencyTaka />
                      <p>
                        {(
                          userData?.balance ||
                          user?.balance ||
                          0
                        ).toLocaleString()}
                      </p>
                    </div>
                  </Link>
                  <Link to={"/profile/deposit"}>
<<<<<<< HEAD
                    <div
                      className="flex justify-center items-center p-2.5 text-xl lg:text-2xl text-white deposit-button rounded-full"
                      style={{
                        backgroundColor: backgroundColor,
                        color: mainColor,
                      }}
                    >
=======
                    <div className="flex justify-center items-center p-2.5 text-xl lg:text-2xl text-white deposit-button rounded-full" style={{ backgroundColor: backgroundColor, color: mainColor }}>
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                      <FaPlus />
                    </div>
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="md:flex items-center gap-4 hidden">
                <Link to={"/login"}>
<<<<<<< HEAD
                  <li
                    className="text-sm font-semibold px-3 py-2 rounded-lg login-button"
                    style={{
                      backgroundColor: primaryColor,
                      color: backgroundColor,
                    }}
                  >
=======
                  <li className="text-sm font-semibold px-3 py-2 rounded-lg login-button" style={{ backgroundColor: primaryColor, color: backgroundColor }}>
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                    প্রবেশ করুন
                  </li>
                </Link>
                <Link to={"/register"}>
<<<<<<< HEAD
                  <li
                    className="text-sm font-semibold px-3 py-2 rounded-lg text-white signup-button"
                    style={{
                      backgroundColor: backgroundColor,
                      color: mainColor,
                    }}
                  >
=======
                  <li className="text-sm font-semibold px-3 py-2 rounded-lg text-white signup-button" style={{ backgroundColor: backgroundColor, color: mainColor }}>
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                    এখনি যোগদিন
                  </li>
                </Link>
              </ul>
            )}

            {/* Language */}
            <ul>
              <li
                onClick={handleModalOpen}
                className="cursor-pointer text-sm lg:text-base font-semibold px-2 py-1 rounded-lg language-button"
                style={{ backgroundColor: "#d6d6d6" }}
              >
                <div className="flex items-center">
                  <div className="w-6 md:w-7">
                    <img src={bdFlag} alt="BD flag" />
                  </div>
                  <FaCaretDown />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom navbar */}
      <div
        className="md:flex hidden relative"
        style={{ backgroundColor: navBackgroundColor }}
      >
        <div className="container mx-auto px-4">
          <ul className="flex whitespace-nowrap overflow-x-auto">
            {/* Single menu */}
            <NavLink
              to={"/"}
              className="text-sm font-semibold flex items-center gap-1 justify-center py-3 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
            >
              <p className="py-1 px-5 border-r-[1px]">
                <IoHome size={20} />
              </p>
            </NavLink>

            {/* Single cricket menu */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <NavLink
                to={"/cricket"}
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
              >
                <p>ক্রিকেট</p>
              </NavLink>
              <div
<<<<<<< HEAD
                style={{ backgroundColor: `${backgroundColor}` }}
=======
                style={{ backgroundColor: backgroundColor }}
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                className={`absolute left-0 top-full w-full z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
                  isHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuData.cricket} />
              </div>
            </div>

            {/* Single casino menu */}
            <div
              onMouseEnter={() => setIsCasinoHovered(true)}
              onMouseLeave={() => setIsCasinoHovered(false)}
            >
              <NavLink
                to={"/casino"}
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
              >
                <p>ক্যাসিনো</p>
              </NavLink>
              <div
<<<<<<< HEAD
                style={{ backgroundColor: `${backgroundColor}` }}
                className={`absolute left-0 top-full w-full  z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
=======
                style={{ backgroundColor: backgroundColor }}
                className={`absolute left-0 top-full w-full z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                  isCasinoHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuData.casino} />
              </div>
            </div>

            {/* Single slot menu */}
            <div
              onMouseEnter={() => setIsSlotHovered(true)}
              onMouseLeave={() => setIsSlotHovered(false)}
            >
              <NavLink
                to={"/slot"}
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
              >
                <p>স্লট গেম</p>
              </NavLink>
              <div
<<<<<<< HEAD
                style={{ backgroundColor: `${backgroundColor}` }}
                className={`absolute left-0 top-full w-full  z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
=======
                style={{ backgroundColor: backgroundColor }}
                className={`absolute left-0 top-full w-full z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                  isSlotHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuData.slot} />
              </div>
            </div>

            {/* Single table game menu */}
            <div
              onMouseEnter={() => setIsTableHovered(true)}
              onMouseLeave={() => setIsTableHovered(false)}
            >
              <NavLink
                to={"/table-games"}
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
              >
                <p>টেবিল গেম</p>
              </NavLink>
              <div
<<<<<<< HEAD
                style={{ backgroundColor: `${backgroundColor}` }}
                className={`absolute left-0 top-full w-full  z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
=======
                style={{ backgroundColor: backgroundColor }}
                className={`absolute left-0 top-full w-full z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                  isTableHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuData.table} />
              </div>
            </div>

            {/* Single sports-book menu */}
            <div
              onMouseEnter={() => setIsSportHovered(true)}
              onMouseLeave={() => setIsSportHovered(false)}
            >
              <NavLink
                to={"/sports-book"}
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
              >
                <p>খেলার বই</p>
              </NavLink>
              <div
<<<<<<< HEAD
                style={{ backgroundColor: `${backgroundColor}` }}
                className={`absolute left-0 top-full w-full  z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
=======
                style={{ backgroundColor: backgroundColor }}
                className={`absolute left-0 top-full w-full z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                  isSportHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuData.sports_book} />
              </div>
            </div>

            {/* Single fishing menu */}
            <div
              onMouseEnter={() => setIsFishingHovered(true)}
              onMouseLeave={() => setIsFishingHovered(false)}
            >
              <NavLink
                to={"/fishing"}
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
              >
                <p>মাছ ধরা</p>
              </NavLink>
              <div
<<<<<<< HEAD
                style={{ backgroundColor: `${backgroundColor}` }}
                className={`absolute left-0 top-full w-full  z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
=======
                style={{ backgroundColor: backgroundColor }}
                className={`absolute left-0 top-full w-full z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                  isFishingHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuData.fishing} />
              </div>
            </div>

            {/* Single Crash menu */}
            <div
              onMouseEnter={() => setIsCrashHovered(true)}
              onMouseLeave={() => setIsCrashHovered(false)}
            >
              <NavLink
                to={"/crash"}
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
              >
                <p>ক্র্যাশ</p>
              </NavLink>
              <div
<<<<<<< HEAD
                style={{ backgroundColor: `${backgroundColor}` }}
                className={`absolute left-0 top-full w-full  z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
=======
                style={{ backgroundColor: backgroundColor }}
                className={`absolute left-0 top-full w-full z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
>>>>>>> d8da507dc8a92c2ffc08e0af0edfb15b26cc2390
                  isCrashHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuData.crash} />
              </div>
            </div>

            {/* Single promotion menu */}
            <NavLink
              to={"/promotion"}
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
            >
              <p>প্রমোশন</p>
            </NavLink>

            {/* Single betting-pass menu */}
            <NavLink
              to={"/betting-pass"}
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
            >
              <p>বেটিং পাস</p>
            </NavLink>

            {/* Single referral menu */}
            <NavLink
              to={"/referral"}
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
            >
              <p>সুপারিশ</p>
            </NavLink>
          </ul>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={handleModalClose}
        title={"Currency and Language"}
      >
        <div className="space-y-4">
          {modalData.map((item) => (
            <div key={item.id} className="flex gap-2 md:gap-6">
              <div className="flex items-center gap-1 md:gap-2 w-full">
                <img className="w-10" src={item.flagSrc} alt={item.currency} />
                <p className="text-sm md:text-base font-semibold text-gray-400">
                  {item.currencySymbol} {item.currency}
                </p>
              </div>
              {item.languages.map((language) => (
                <button
                  key={language}
                  className="w-full px-3 py-2 text-sm md:text-base font-semibold text-gray-500 hover:text-yellow-300 hover:bg-red-50 border border-gray-300 rounded"
                >
                  {language}
                </button>
              ))}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
