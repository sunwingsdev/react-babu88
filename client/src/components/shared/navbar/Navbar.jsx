import { Link, NavLink, useNavigate } from "react-router-dom";
import { FaCaretDown, FaPlus, FaUser } from "react-icons/fa";
import { IoMdNotifications } from "react-icons/io";
import { TbCurrencyTaka } from "react-icons/tb";
import { IoHome, IoMenuOutline } from "react-icons/io5";
import { useState } from "react";
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
    image: cricket,
    title: " ক্রিকেট",
    route: "/cricket",
    badge: "",
  },
  {
    id: 2,
    image: ld,
    title: " ক্যাসিনো",
    route: "/cricket",
    badge: "",
  },
  {
    id: 3,
    image: rng,
    title: " স্লট গেম",
    route: "/cricket",
    badge: "",
  },
  {
    id: 4,
    image: table,
    title: " টেবিল গেম",
    route: "/cricket",
    badge: "",
  },
  {
    id: 5,
    image: sb,
    title: "খেলার বই",
    route: "/cricket",
    badge: "",
  },
  {
    id: 6,
    image: fishing,
    title: "মাছ ধরা",
    route: "/cricket",
    badge: "",
  },
  {
    id: 7,
    image: crash,
    title: "ক্র্যাশ",
    route: "/cricket",
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
  const { user, token } = useSelector((state) => state.auth);
<<<<<<< HEAD
  const {   mainBackgroundTextColor ,  mainBackgroundColor,  mobileSidebarMenuBackgroundColor ,mobileSidebarMenuTextColor,mobileSidebarMenuIconColor } = useSelector((state) => state.themeColor);
=======
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();
  // cricket
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
  // casino
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
  // slot
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
  // table-games
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
  // sport
  const megaMenuSportBook = [
    {
      route: "/sports-book",
      image: "https://jiliwin.9terawolf.com/images/babu/menu/sb/ibc_new.png",
    },
  ];
  // fishing
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

<<<<<<< HEAD
  const [mainColor,setMainColor] = useState( mainBackgroundTextColor );
  const [backgroundColor,setBackgroundColor] = useState(mainBackgroundColor);


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

=======
  {
    /* মডাল ডেটা */
  }
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
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
  const [isHovered, setIsHovered] = useState(false); // State for hover
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

  return (
    <div className="z-20">
      {/* Start top navbar */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Mobile menu icon */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
<<<<<<< HEAD
              <SheetTrigger asChild style={{border:"none"}}>
                <button className="ml-auto border-none" style={{border:"none"}}>
                  <IoMenuOutline size={30} style={{border:"none"}} />
                </button>
              </SheetTrigger>
              <SheetContent
                className=" w-64 p-2"
                side="left"
                style={{ backgroundColor: mobileSidebarMenuBackgroundColor}}
=======
              <SheetTrigger asChild>
                <button>
                  <IoMenuOutline size={30} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className=" bg-slate-50 text-gray-600 w-64 p-2"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
              >
                <SheetClose asChild className="border-b-2 pb-2">
                  <div className="w-40">
                    <Link to={"/"}>
                      <img
                        src={`${import.meta.env.VITE_BASE_API_URL}${
                          logo?.image
                        }`}
                        alt=""
                      />
                    </Link>
                  </div>
                   
                </SheetClose>
              
                <ul className="space-y-6 overflow-y-auto h-[92%]">
                  {data?.map((item) => (
                    <SheetClose key={item.id} asChild>
                      <Link to={item.route}>
                        <li className="flex items-center justify-start gap-3 mt-4 text-xs font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
<<<<<<< HEAD
                          <img className="w-6" src={item.image} alt={item.title} />
                         
                          <p style={{color : mobileSidebarMenuTextColor}} className="">{item.title}</p>
=======
                          <img className="w-6" src={item.image} alt="" />
                          <p className="text-[#9b9b9b]">{item.title}</p>
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
                          {item?.badge &&
                            (item?.badge === "hot" ? (
                              <div className="w-8 animate-pulse">
                                <img className="w-full" src={hotIcon} alt="" />
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
                    <p className="text-sm font-semibold" style={{color : mobileSidebarMenuTextColor}}>Games</p>
                  </div>
<<<<<<< HEAD
                  
                 
=======
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
                  {gamesData?.map((item) => (
                    <SheetClose key={item.id} asChild>
                      <Link to={item.route}>
                        <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
<<<<<<< HEAD
                          <img className="w-6" src={item.image} alt={item.title} />
                          <p  style={{color : mobileSidebarMenuTextColor}}>{item.title}</p>
=======
                          <img className="w-6" src={item.image} alt="" />
                          <p className="text-[#9b9b9b]">{item.title}</p>
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
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
                    <p className="text-sm font-semibold" style={{color : mobileSidebarMenuTextColor}}>Others</p>
                  </div>
                  <SheetClose asChild>
                    <Link to={"/"}>
                      <li
                        onClick={handleModalOpen}
                        className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg"
                      >
<<<<<<< HEAD
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/language.svg"
                          alt="Language"
                        />
                        <p  style={{color : mobileSidebarMenuTextColor}}>ভাষা</p>
=======
                        <img className="w-4" src={language} alt="" />
                        <p className="text-[#9b9b9b]"> ভাষা</p>
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
                      </li>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to={"/faq"}>
                      <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
<<<<<<< HEAD
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/faq.svg"
                          alt="FAQ"
                        />
                        <p  style={{color : mobileSidebarMenuTextColor}}>প্রায়শই জিজ্ঞাসিত প্রশ্নাবলী</p>
=======
                        <img className="w-4" src={faq} alt="" />
                        <p className="text-[#9b9b9b]">
                          {" "}
                          প্রায়শই জিজ্ঞাসিত প্রশ্নাবল
                        </p>
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
                      </li>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to={"/faq"}>
                      <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
<<<<<<< HEAD
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/liveChat.svg"
                          alt="Live Chat"
                        />
                        <p  style={{color : mobileSidebarMenuTextColor}}>সরাসরি কথোপকথন</p>
=======
                        <img className="w-4" src={liveChat} alt="" />
                        <p className="text-[#9b9b9b]"> সরাসরি কথোপকথন</p>
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
                      </li>
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link to={"./babu88.apk"} target={"_blank"} download>
                      <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
<<<<<<< HEAD
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/downloadApp.svg"
                          alt="Download App"
                        />
                        <p  style={{color : mobileSidebarMenuTextColor}}>ডাউনলোড করুন</p>
=======
                        <img className="w-4" src={downloadApp} alt="" />
                        <p className="text-[#9b9b9b]">ডাউনলোড করুন</p>
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
                      </li>
                    </Link>
                  </SheetClose>
                  {user && (
                    <SheetClose asChild>
                      <li
                        onClick={handleLogout}
                        className="flex gap-4 mt-10 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg"
                      >
<<<<<<< HEAD
                        <img
                          className="w-4"
                          src="https://babo88.com/static/svg/mobileMenu/logout.svg"
                          alt="Logout"
                        />
                        <p  style={{color : mobileSidebarMenuTextColor}}>প্রস্থান</p>
=======
                        <img className="w-4" src={logoutImage} alt="Logout" />
                        <p className="text-black">প্রস্থান</p>
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
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
                alt=""
              />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Sign up */}

            {/* dashboard */}
            {token && user ? (
              <div className="md:flex justify-center items-center gap-3 hidden">
                <div className="flex justify-center items-center gap-2 lg:gap-3">
                  <p className="text-lg font-bold">{user?.username}</p>
                  <Link to={"/profile"}>
                    <div className="flex justify-center items-center p-3 text-base lg:text-xl bg-yellow-400 hover:bg-yellow-500 duration-300 rounded-full">
                      <FaUser />
                    </div>
                  </Link>
                  <Link to={"/profile/inbox"} className="relative">
                    <div className="flex justify-center items-center p-2.5 text-xl lg:text-2xl bg-yellow-400 hover:bg-yellow-500 duration-300 rounded-full">
                      <IoMdNotifications />
                    </div>
                    <div className="absolute -top-1 -right-1 flex justify-center items-center w-5 h-5 text-xs text-white bg-blue-500 rounded-full">
                      58
                    </div>
                  </Link>
                  <div>
                    <button
                      onClick={handleLogout}
                      className="flex justify-center items-center p-2.5 text-xl lg:text-2xl bg-yellow-400 hover:bg-yellow-500 duration-300 rounded-full"
                    >
                      <RiLogoutCircleRFill />
                    </button>
                  </div>
                  <div className="w-1 h-10 border-r border-gray-400"></div>
                </div>
                <div className="flex gap-2 items-center pl-4 rounded-full bg-gray-200">
                  <Link>
                    <div className="flex items-center text-xl lg:text-2xl">
                      <TbCurrencyTaka />
<<<<<<< HEAD
                      <p>{(userData?.balance || user?.balance || 0).toLocaleString()} {!userData?.balance && 0}</p>
=======
                      <p>*.**</p>
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
                    </div>
                  </Link>
                  <Link to={"/profile/deposit"}>
                    <div className="flex justify-center items-center p-2.5 text-xl lg:text-2xl text-white bg-blue-500 hover:bg-blue-600 duration-300 rounded-full">
                      <FaPlus />
                    </div>
                  </Link>
                </div>
              </div>
            ) : (
              <ul className="md:flex items-center gap-4 hidden">
                <Link to={"/login"}>
                  <li className="text-sm font-semibold px-3 py-2 rounded-lg bg-[#FFCD03] hover:bg-[#e5be22] transition-all duration-500">
                    প্রবেশ করুন
                  </li>
                </Link>
                <Link to={"/register"}>
                  <li className="text-sm font-semibold px-3 py-2 rounded-lg text-white bg-[#0083FB] hover:bg-[#2f9bff] transition-all duration-500">
                    এখনি যোগদিন
                  </li>
                </Link>
              </ul>
            )}

            {/* Language */}
            <ul>
              <li
                onClick={handleModalOpen}
                className="cursor-pointer text-sm lg:text-base font-semibold px-2 py-1 rounded-lg bg-[#d6d6d6] hover:bg-[#c2c2c2] transition-all duration-500"
              >
                <div className="flex items-center">
                  <div className="w-6 md:w-7">
                    <img
                      src={
                        "https://png.pngtree.com/png-vector/20220606/ourmid/pngtree-bangladesh-flag-icon-in-modern-neomorphism-style-png-image_4872074.png"
                      }
                      alt="BD flag"
                    />
                  </div>
                  <FaCaretDown />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom navbar */}
<<<<<<< HEAD
      <div className="md:flex hidden relative" style={{ backgroundColor: navBackgroundColor  , color: mainBackgroundTextColor}}>
=======
      <div className="bg-[#333] md:flex hidden relative">
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
        <div className="container mx-auto px-4">
          <ul className="flex whitespace-nowrap overflow-x-auto">
            {/* single menu */}
            <NavLink
              to={"/"}
              className="text-sm font-semibold flex items-center gap-1 justify-center py-3 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
            >
              <p className="py-1 px-5 border-r-[1px]">
                <IoHome size={20}  style={{ color: mainBackgroundTextColor }} />
              </p>
            </NavLink>

            {/* single cricket menu */}
            <div
              className=""
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <NavLink
                to={"/cricket"}
<<<<<<< HEAD
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4  nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
                style={{ color: mainBackgroundTextColor }}
=======
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
              >
                <p>ক্রিকেট</p>
              </NavLink>
              {/* MegaMenu */}
              <div
                className={`absolute left-0 top-full w-full bg-[#313131] z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
                  isHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuCricket} />
              </div>
            </div>

            {/* single casino menu */}
            <div
              className=""
              onMouseEnter={() => setIsCasinoHovered(true)}
              onMouseLeave={() => setIsCasinoHovered(false)}
            >
              <NavLink
                to={"/casino"}
<<<<<<< HEAD
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
                 style={{ color: mainBackgroundTextColor }}
=======
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
              >
                <p>ক্যাসিনো</p>
              </NavLink>
              {/* MegaMenu */}
              <div
                className={`absolute left-0 top-full w-full bg-[#313131] z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
                  isCasinoHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <div className="">
                  <MegaMenu items={megaMenuCasino} />
                </div>
              </div>
            </div>

            {/* single slot menu */}
            <div
              className=""
              onMouseEnter={() => setIsSlotHovered(true)}
              onMouseLeave={() => setIsSlotHovered(false)}
            >
              <NavLink
                to={"/slot"}
<<<<<<< HEAD
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
                 style={{ color: mainBackgroundTextColor }}
=======
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
              >
                <p>স্লট গেম</p>
              </NavLink>
              {/* MegaMenu */}
              <div
                className={`absolute left-0 top-full w-full bg-[#313131] z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
                  isSlotHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <div className="">
                  <MegaMenu items={megaMenuSlot} />
                </div>
              </div>
            </div>

            {/* single table game menu */}
            <div
              className=""
              onMouseEnter={() => setIsTableHovered(true)}
              onMouseLeave={() => setIsTableHovered(false)}
            >
              <NavLink
                to={"/table-games"}
<<<<<<< HEAD
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
                 style={{ color: mainBackgroundTextColor }}
=======
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
              >
                <p>টেবিল গেম</p>
              </NavLink>
              {/* MegaMenu */}
              <div
                className={`absolute left-0 top-full w-full bg-[#313131] z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
                  isTableHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuTable} />
              </div>
            </div>

            {/* single sports-book menu */}
            <div
              className=""
              onMouseEnter={() => setIsSportHovered(true)}
              onMouseLeave={() => setIsSportHovered(false)}
            >
              <NavLink
                to={"/sports-book"}
<<<<<<< HEAD
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
                 style={{ color: mainBackgroundTextColor }}
=======
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
              >
                <p>খেলার বই</p>
              </NavLink>
              {/* MegaMenu */}
              <div
                className={`absolute left-0 top-full w-full bg-[#313131] z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
                  isSportHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuSportBook} />
              </div>
            </div>

            {/* single fishing menu */}
            <div
              className=""
              onMouseEnter={() => setIsFishingHovered(true)}
              onMouseLeave={() => setIsFishingHovered(false)}
            >
              <NavLink
<<<<<<< HEAD
                to={"/fishing"}
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
                 style={{ color: mainBackgroundTextColor }}
=======
                to={"/sports-book"}
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
              >
                <p>মাছ ধরা</p>
              </NavLink>
              {/* MegaMenu */}
              <div
                className={`absolute left-0 top-full w-full bg-[#313131] z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
                  isFishingHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuFishing} />
              </div>
            </div>

            {/* single Crash menu */}
            <div
              className=""
              onMouseEnter={() => setIsCrashHovered(true)}
              onMouseLeave={() => setIsCrashHovered(false)}
            >
              <NavLink
                to={"/crash"}
<<<<<<< HEAD
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
                 style={{ color: mainBackgroundTextColor }}
=======
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
              >
                <p>ক্র্যাশ</p>
              </NavLink>
              {/* MegaMenu */}
              <div
                className={`absolute left-0 top-full w-full bg-[#313131] z-20 text-black p-5 transform transition-transform duration-300 ease-in-out ${
                  isCrashHovered
                    ? "translate-y-0 opacity-100"
                    : "-translate-y-10 opacity-0 pointer-events-none"
                }`}
              >
                <MegaMenu items={megaMenuCrash} />
              </div>
            </div>

            {/* single promotion menu */}
            <NavLink
              to={"/promotion"}
<<<<<<< HEAD
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
               style={{ color: mainBackgroundTextColor }}
=======
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
            >
              <p>প্রমোশন</p>
            </NavLink>

            {/* single betting-pass menu */}
            <NavLink
              to={"/betting-pass"}
<<<<<<< HEAD
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
                    style={{ color: mainBackgroundTextColor }}
=======
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
            >
              <p>বেটিং পাস</p>
            </NavLink>

            {/* single referral menu */}
            <NavLink
              to={"/referral"}
<<<<<<< HEAD
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white nav-link border-b-[4px] border-b-transparent transition-colors duration-200 ease-linear"
               style={{ color: mainBackgroundTextColor }}
=======
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
>>>>>>> 0b6fa38d8ef754b93142ee658ceb8ede65cf17d7
            >
              <p>সুপারিশ</p>
            </NavLink>

            {/* Add other menu items */}
          </ul>
        </div>
      </div>

      {/* মডাল */}
      <Modal
        isOpen={isModalOpen}
        onOpenChange={handleModalClose}
        title={"Currency and Language"}
      >
        <div className="space-y-4">
          {modalData.map((item) => (
            <div key={item.id} className="flex gap-2 md:gap-6">
              {/* মুদ্রা তথ্য */}
              <div className="flex items-center gap-1 md:gap-2 w-full">
                <img className="w-10" src={item.flagSrc} alt={item.currency} />
                <p className="text-sm md:text-base font-semibold text-gray-400">
                  {item.currencySymbol} {item.currency}
                </p>
              </div>
              {/* ভাষা বাটন */}
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
