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
import {  useLazyGetUserByIdQuery } from "@/redux/features/allApis/usersApi/usersApi";
import hotIcon from "@/assets/images/hot-icon.png";

const data = [
  {
    id: 1,
    image: "https://www.babu88.app/static/svg/mobileMenu/promotion.svg",
    title: "প্রমোশন",
    route: "/promotion",
    badge: "",
  },
  {
    id: 2,
    image: "https://www.babu88.app/static/svg/mobileMenu/rewards.svg",
    title: "পুরস্কার",
    route: "/profile/rewards",
    badge: "new",
  },
  {
    id: 3,
    image: "https://www.babu88.app/static/svg/mobileMenu/referAndEarn.svg",
    title: "রেফারেল প্রোগ্রাম",
    route: "/profile/rewards",
    badge: "hot",
  },
  {
    id: 4,
    image: "https://www.babu88.app/static/svg/mobileMenu/bettingPass.svg",
    title: "বেটিং পাস",
    route: "/profile/rewards",
    badge: "hot",
  },
  {
    id: 5,
    image: "https://www.babu88.app/static/svg/mobileMenu/bpass_ipl_icon.svg",
    title: "IPL 2025 বেটিং পাস",
    route: "/profile/rewards",
    badge: "hot",
  },
  {
    id: 6,
    image: "https://www.babu88.app/static/svg/mobileMenu/agentAff.svg",
    title: "অ্যাফিলিয়েট",
    route: "/profile/rewards",
    badge: "",
  },
];

const gamesData = [
  {
    id: 1,
    image: "https://www.babu88.app/static/svg/mobileMenu/cricket.svg",
    title: " ক্রিকেট",
    route: "/cricket",
    badge: "",
  },
  {
    id: 2,
    image: "https://www.babu88.app/static/svg/mobileMenu/ld.svg",
    title: " ক্যাসিনো",
    route: "/cricket",
    badge: "",
  },
  {
    id: 3,
    image: "https://www.babu88.app/static/svg/mobileMenu/rng.svg",
    title: " স্লট গেম",
    route: "/cricket",
    badge: "",
  },
  {
    id: 4,
    image: "https://www.babu88.app/static/svg/mobileMenu/table.svg",
    title: " টেবিল গেম",
    route: "/cricket",
    badge: "",
  },
  {
    id: 5,
    image: "https://www.babu88.app/static/svg/mobileMenu/sb.svg",
    title: "খেলার বই",
    route: "/cricket",
    badge: "",
  },
  {
    id: 6,
    image: "https://www.babu88.app/static/svg/mobileMenu/fishing.svg",
    title: "মাছ ধরা",
    route: "/cricket",
    badge: "",
  },
  {
    id: 7,
    image: "https://www.babu88.app/static/svg/mobileMenu/crash.svg",
    title: "ক্র্যাশ",
    route: "/cricket",
    badge: "new",
  },
  {
    id: 8,
    image: "https://www.babu88.app/static/svg/mobileMenu/fastgames.svg",
    title: "দ্রুতগতির গেমস",
    route: "/cricket",
    badge: "",
  },
];

const Navbar = () => {
  const { data: homeControls } = useGetHomeControlsQuery();
  const { user, token } = useSelector((state) => state.auth);
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

  {
    /* মডাল ডেটা */
  }
  const modalData = [
    {
      id: 1,
      currency: "BDT",
      currencySymbol: "৳",
      flagSrc: "https://www.babu88.app/static/image/country/BDT.svg",
      languages: ["ENGLISH", "BENGALI"],
    },
    {
      id: 2,
      currency: "INR",
      currencySymbol: "₹",
      flagSrc: "https://www.babu88.app/static/image/country/INR.svg",
      languages: ["ENGLISH", "HINDI"],
    },
    {
      id: 3,
      currency: "NPR",
      currencySymbol: "₨",
      flagSrc: "https://www.babu88.app/static/image/country/NPR.svg",
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


const [triggerGetUserById, { data: userData, isLoading, isError }] = useLazyGetUserByIdQuery();



  const getUserDataAgain = (props) => {

    if (props) {
      triggerGetUserById(props);
    }

  };



  useEffect(() => {
    
    if (user) {
      triggerGetUserById(user._id);
    }
  }, [user]);




  return (
    <div className="z-20">
      {/* Start top navbar */}
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          {/* Mobile menu icon */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <button>
                  <IoMenuOutline size={30} />
                </button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className=" bg-slate-50 text-gray-600 w-64 p-2"
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
                          <img className="w-6" src={item.image} alt="" />
                          <p className="text-[#9b9b9b]">{item.title}</p>
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
                    <p className="text-sm font-semibold">Games</p>
                  </div>
                  {gamesData?.map((item) => (
                    <SheetClose key={item.id} asChild>
                      <Link to={item.route}>
                        <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
                          <img className="w-6" src={item.image} alt="" />
                          <p className="text-[#9b9b9b]">{item.title}</p>
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
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/language.svg"
                          alt=""
                        />
                        <p className="text-[#9b9b9b]"> ভাষা</p>
                      </li>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to={"/faq"}>
                      <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/faq.svg"
                          alt=""
                        />
                        <p className="text-[#9b9b9b]">
                          {" "}
                          প্রায়শই জিজ্ঞাসিত প্রশ্নাবল
                        </p>
                      </li>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link to={"/faq"}>
                      <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/liveChat.svg"
                          alt=""
                        />
                        <p className="text-[#9b9b9b]"> সরাসরি কথোপকথন</p>
                      </li>
                    </Link>
                  </SheetClose>

                  <SheetClose asChild>
                    <Link to={"./babu88.apk"} target={"_blank"} download>
                      <li className="flex gap-4 mt-1 text-sm font-medium px-3 py-2 hover:bg-slate-200 rounded-lg">
                        <img
                          className="w-4"
                          src="https://www.babu88.app/static/svg/mobileMenu/downloadApp.svg"
                          alt=""
                        />
                        <p className="text-[#9b9b9b]">ডাউনলোড করুন</p>
                      </li>
                    </Link>
                  </SheetClose>
                  {/* Add other menu items as needed */}
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
                    <div className="flex items-center text-xl lg:text-2xl" onClick={() => user && getUserDataAgain(user._id) } >
                      <TbCurrencyTaka />
                      <p>{userData?.balance ? userData?.balance : user?.balance }</p>
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
      <div className="bg-[#333] md:flex hidden relative">
        <div className="container mx-auto px-4">
          <ul className="flex whitespace-nowrap overflow-x-auto">
            {/* single menu */}
            <NavLink
              to={"/"}
              className="text-sm font-semibold flex items-center gap-1 justify-center py-3 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
            >
              <p className="py-1 px-5 border-r-[1px]">
                <IoHome size={20} />
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
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
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
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
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
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
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
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
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
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
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
                to={"/sports-book"}
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
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
                className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
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
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
            >
              <p>প্রমোশন</p>
            </NavLink>

            {/* single betting-pass menu */}
            <NavLink
              to={"/betting-pass"}
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
            >
              <p>বেটিং পাস</p>
            </NavLink>

            {/* single referral menu */}
            <NavLink
              to={"/referral"}
              className="text-sm font-semibold flex items-center gap-1 justify-center px-5 py-4 text-white hover:text-[#FFCD03] hover:bg-[#424242] border-b-[4px] border-b-[#333] hover:border-b-[4px] hover:border-b-[#ffb300] transition-colors duration-200 ease-linear"
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
