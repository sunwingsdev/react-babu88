import { IoMdHome } from "react-icons/io";

import {
  IoGameController,
  IoLogoWechat,
  IoSettingsSharp,
} from "react-icons/io5";

import { FaAffiliatetheme, FaUsers } from "react-icons/fa";
import { PiCashRegister } from "react-icons/pi";
import { GiGamepadCross, GiRibbonMedal } from "react-icons/gi";
import { SlGameController } from "react-icons/sl";
import { BsBank, BsFront, BsPiggyBank, BsShop } from "react-icons/bs";
import { useState } from "react";
import DashboardMobileMenu from "../components/dashboard/DashboardMobileMenu";
import { Outlet } from "react-router-dom";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const menuItems = [
    { name: "Dashboard", icon: <IoMdHome />, path: "/dashboard" },
    {
      name: "Users",
      icon: <FaUsers />,
      path: "",
    },
    {
      name: "Cash Agent",
      icon: <PiCashRegister />,
      submenu: [
        { name: "All Agents", path: "" },
        { name: "KYC", path: "" },
        {
          name: "Payment Requests",
          path: "",
        },
      ],
    },
    {
      name: "Affiliators",
      icon: <FaAffiliatetheme />,

      submenu: [
        { name: "All Affiliates", path: "" },
        { name: "All Affiliate Links", path: "" },
      ],
    },
    {
      name: "Games Control",
      icon: <IoGameController />,
      submenu: [
        { name: "Add Categories", path: "/dashboard/add-category" },
        { name: "Add Game", path: "/dashboard/add-game" },
        { name: "Active Games", path: "" },
        { name: "Inactive Games" },
      ],
    },
    {
      name: "Games Api key",
      icon: <GiGamepadCross />,
      submenu: [
        { name: "Sprots Live TV", path: "" },
        { name: "BetFair API", path: "" },
        {
          name: "Sports Radar API",
          path: "",
        },
        { name: "Odds Jam API", path: "" },
        {
          name: "Bet Construct API",
          path: "",
        },
        { name: "Kambi API", path: "" },
        { name: "Pinnacle API", path: "" },
        { name: "SoftSwiss API", path: "" },
        { name: "Betradar API", path: "" },
        { name: "Evolution API", path: "" },
        {
          name: "Pragmatic Play API",
          path: "",
        },
        { name: "Playtech API", path: "" },
        { name: "NetEnt API", path: "" },
        {
          name: "Betsoft Gaming API",
          path: "",
        },
      ],
    },
    {
      name: "Bonuses",
      icon: <GiRibbonMedal />,
      submenu: [
        { name: "Happy Hours" },
        { name: "Deposit Bonuses" },
        { name: "Refer Bonuses" },
        { name: "Welcome Bonuses" },
      ],
    },
    {
      name: "Game History",
      icon: <SlGameController />,
      submenu: [
        { name: "Play Stats" },
        { name: "Win Game Stats" },
        { name: "Loss Game Stats" },
      ],
    },
    { name: "Tournament", icon: <BsShop /> },
    { name: "Jack Pot", icon: <BsShop /> },
    {
      name: "Frontend",
      icon: <BsFront />,
      submenu: [
        { name: "Home Control", path: "/dashboard/home-control" },
        { name: "Promotions" },
        { name: "Pages" },
        { name: "FAQ" },
        { name: "Sponsorship" },
        { name: "Brand Ambassador" },
      ],
    },
    {
      name: "Banking Deposit",
      icon: <BsPiggyBank />,
      submenu: [
        { name: "Deposit Promotion", path: "/dashboard/depositPromotion" },
        { name: "Deposit Method", path: "/dashboard/depositmethod" },
        { name: "Deposit History", path: "/dashboard/DepositHistory" },
      ],
    },
    {
      name: "Banking Withdraw",
      icon: <BsBank />,
      submenu: [
        { name: "Withdraw Method", path: "/dashboard/withdrawMethods" },
        { name: "Withdraw History", path: "/dashboard/WithdrawalHistory" },
      ],
    },
    {
      name: "Settings",
      icon: <IoSettingsSharp />,
      submenu: [
        { name: "Pincodes" },
        { name: "Activity Log" },
        { name: "Permissions" },
        { name: "Gateway API Keys" },
        { name: "SMS" },
        { name: "Mailings" },
        { name: "Support" },
        { name: "Security" },
        { name: "Commission", path: "/dashboard/commissionsetting" },
      ],
    },
    {
      name: "Oracle Technology",
      icon: <IoLogoWechat />,
      submenu: [
        { name: "Instant Support" },
        { name: "Normal Support" },
        { name: "Permissions" },
        { name: "Notice" },
        { name: "About Us" },
        { name: "Contact Us" },
      ],
    },
  ];
  return (
    <div className="flex">
      {/* DashboardSidebar */}
      <DashboardSidebar open={open} setOpen={setOpen} menuItems={menuItems} />
      <div
        className={`flex-1 h-screen overflow-y-auto duration-300 ${
          !open ? "md:pl-16" : "md:pl-64"
        }`}
      >
        <DashboardMobileMenu open={open} menuItems={menuItems} />
        <div className="mt-[62px] md:mt-14 p-2">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
