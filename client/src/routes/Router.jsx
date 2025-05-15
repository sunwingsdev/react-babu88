import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import Home from "../pages/home/home/Home";
import Login from "../pages/login/Login";
import Registration from "../pages/registration/Registration";
import Casino from "../pages/home/casino/Casino";
import Slot from "../pages/home/slot/Slot";
import TableGames from "@/pages/home/tableGames/TableGames";
import SportsBook from "@/pages/home/sportsBook/SportsBook";
import Fishing from "@/pages/home/fishing/Fishing";
import Crash from "@/pages/home/crash/Crash";
import Promotion from "@/pages/home/promotion/Promotion";
import Referral from "@/pages/home/referral/Referral";
import Cricket from "@/pages/home/cricket/Cricket";
import BettingPass from "@/pages/home/bettingPass/BettingPass";
import MegaMenu from "@/components/shared/megaMenu/MegaMenu";
import Faq from "@/pages/home/faq/Faq";
import Profile from "@/components/dashboard/profile/Profile";
import MyProfile from "@/components/dashboard/profile/myProfile/MyProfile";
import Inbox from "@/components/dashboard/profile/inbox/Inbox";
import Deposit from "@/components/dashboard/profile/deposit/Deposit";
import Withdrawal from "@/components/dashboard/profile/deposit/Withdrawal";
import Voucher from "@/components/dashboard/profile/deposit/Voucher";
import Rewards from "@/components/dashboard/profile/rewards/Rewards";
import PrivateRoute from "./PrivateRoute";
import DemoGame from "@/pages/home/DemoGame/DemoGame";
import DashboardLayout from "@/layout/DashboardLayout";
import DashboardHome from "@/pages/dashboard/DashboardHome";
import HomeControl from "@/pages/dashboard/HomeControl";
import AdminRoute from "./AdminRoute";
import AddDepositMethods from "@/components/dashboard/Dashboard-Page/Add-Deposit-Methods/AddDepositMethods";
import DepositPromotion from "@/components/dashboard/Dashboard-Page/DepositPromotion/DepositPromotion";

import DepositHistory from "@/components/dashboard/Dashboard-Page/Deposit-History/DepositHistory";
import AddWithdrawMethods from "@/components/dashboard/Dashboard-Page/Add-Withdrow-Methods/AddWithdrowMethods";

import AdminLogin from "@/pages/AdminLogin";


const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/demogame/:id",
        element: <DemoGame />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Registration />,
      },
      {
        path: "/cricket",
        element: <Cricket />,
      },
      {
        path: "/casino",
        element: <Casino />,
      },
      {
        path: "/slot",
        element: <Slot />,
      },
      {
        path: "/table-games",
        element: <TableGames />,
      },
      {
        path: "/sports-book",
        element: <SportsBook />,
      },
      {
        path: "/fishing",
        element: <Fishing />,
      },
      {
        path: "/crash",
        element: <Crash />,
      },
      {
        path: "/betting-pass",
        element: <BettingPass />,
      },
      {
        path: "/promotion",
        element: <Promotion />,
      },
      {
        path: "/referral",
        element: <Referral />,
      },
      {
        path: "/mega-menu",
        element: <MegaMenu />,
      },
      {
        path: "/faq",
        element: <Faq />,
      },
      {
        path: "/profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
        children: [
          {
            path: "",
            element: <MyProfile />,
          },
          {
            path: "inbox",
            element: <Inbox />,
          },
          {
            path: "deposit",
            element: <Deposit />,
          },
          {
            path: "withdrawal",
            element: <Withdrawal />,
          },
          {
            path: "voucher",
            element: <Voucher />,
          },
          {
            path: "rewards",
            element: <Rewards />,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <AdminRoute>
        <DashboardLayout />
      </AdminRoute>
    ),
    children: [
      {
        path: "",
        element: <DashboardHome />,
      },
      { path: "home-control", element: <HomeControl /> },
      {
        path: "depositmethod",
        element: <AddDepositMethods />, // Add the new route
      },
   
      {
        path: "depositPromotion",
        element: <DepositPromotion />, // Add the new route
      },
      {
        path: "DepositHistory",
        element: <DepositHistory />, // Add the new route
      },
         {
        path: "withdrawMethods",
        element: <AddWithdrawMethods />, // Add the new route
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLogin />,
  },
]);

export default router;
