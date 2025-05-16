import { useEffect, useState } from "react";
import {
  FaClock,
  FaGamepad,
  FaHourglass,
  FaMoneyBill,
  FaMoneyBillWave,
  FaMoneyCheck,
  FaMoneyCheckAlt,
  FaPlay,
  FaRobot,
  FaShieldAlt,
  FaStop,
  FaUserCheck,
  FaUserFriends,
  FaUserPlus,
  FaUsers,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

const StatCard = ({ title, value, icon, themeColor, onClick }) => (
  <div onClick={onClick} className="col-6 md:col-3 p-2 flex justify-center">
    <div
      style={{
        backgroundImage: `linear-gradient(to right, #333, ${themeColor})`,
      }}
      className="relative w-full max-w-[300px] min-h-[120px] flex flex-row justify-between items-center p-4 rounded-lg shadow-md transition-transform duration-200 ease-in-out hover:-translate-y-0.5 hover:shadow-lg border border-gray-200 cursor-pointer"
    >
      <div className="flex flex-col justify-center">
        {value === "Loading..." ? (
          <div className="inline-block w-5 h-5 border-2 border-gray-200 border-t-gray-500 rounded-full animate-spin mb-2"></div>
        ) : (
          <div className="text-lg md:text-xl font-bold text-white">{value}</div>
        )}
        <div className="text-xs md:text-sm font-medium text-yellow-300 uppercase tracking-wide">
          {title.length > 20 ? `${title.slice(0, 17)}...` : title}
        </div>
      </div>
      <div className="text-2xl md:text-3xl text-white">{icon}</div>
    </div>
  </div>
);

export default function DashboardHome() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [dashboardData, setDashboardData] = useState({
    totalUsers: "Loading...",
    totalGames: "Loading...",
    totalDeposit: "Loading...",
    todayDeposit: "Loading...",
    totalWithdraw: "Loading...",
    todayWithdraw: "Loading...",
    pendingDepositRequests: "Loading...",
    pendingWithdrawRequests: "Loading...",
    totalAffiliator: 0,
    totalWalletAgent: 0,
    totalWhiteLabel: 0,
    totalGameApi: 0,
    activeGame: 0,
    inactiveGame: 0,
    affiliateSignupRequest: 0,
    walletAgentSignupRequest: 0,
  });

  const baseURL = import.meta.env.VITE_BASE_API_URL;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch(`${baseURL}/admin/dashboard`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch dashboard data");
        }
        const { data } = await response.json();
        setDashboardData({
          totalUsers: data.totalUsers,
          totalGames: data.totalGames,
          totalDeposit: data.totalDeposit.toFixed(2),
          todayDeposit: data.todayDeposit.toFixed(2),
          totalWithdraw: data.totalWithdraw.toFixed(2),
          todayWithdraw: data.todayWithdraw.toFixed(2),
          pendingDepositRequests: data.pendingDepositRequests,
          pendingWithdrawRequests: data.pendingWithdrawRequests,
          totalAffiliator: data.totalAffiliator,
          totalWalletAgent: data.totalWalletAgent,
          totalWhiteLabel: data.totalWhiteLabel,
          totalGameApi: data.totalGameApi,
          activeGame: data.activeGame,
          inactiveGame: data.inactiveGame,
          affiliateSignupRequest: data.affiliateSignupRequest,
          walletAgentSignupRequest: data.walletAgentSignupRequest,
        });
      } catch (err) {
        const errorMessage = err.message || "Failed to fetch dashboard data";
        setDashboardData({
          totalUsers: errorMessage,
          totalGames: errorMessage,
          totalDeposit: errorMessage,
          todayDeposit: errorMessage,
          totalWithdraw: errorMessage,
          todayWithdraw: errorMessage,
          pendingDepositRequests: errorMessage,
          pendingWithdrawRequests: errorMessage,
          totalAffiliator: 0,
          totalWalletAgent: 0,
          totalWhiteLabel: 0,
          totalGameApi: 0,
          activeGame: 0,
          inactiveGame: 0,
          affiliateSignupRequest: 0,
          walletAgentSignupRequest: 0,
        });
      }
    };

    fetchDashboardData();
  }, []);

  const statsDataForUserRow = [
    {
      title: "Total User",
      value: dashboardData.totalUsers,
      icon: <FaUsers />,
      route: "/dashboard/all-user",
      themeColor: "#b81e2d",
    },
    {
      title: "Total Affiliator",
      value: dashboardData.totalAffiliator,
      icon: <FaUserFriends />,
      route: "/",
      themeColor: "#b81e2d",
    },
    {
      title: "Total Wallet Agent",
      value: dashboardData.totalWalletAgent,
      icon: <FaUserCheck />,
      route: "/",
      themeColor: "#b81e2d",
    },
    {
      title: "Total White Label",
      value: dashboardData.totalWhiteLabel,
      icon: <FaShieldAlt />,
      route: "/",
      themeColor: "#b81e2d",
    },
  ];

  const statsDataForGameRow = [
    {
      title: "Total Game",
      value: dashboardData.totalGames,
      icon: <FaGamepad />,
      route: "/dashboard/game-categories",
      themeColor: "#45f82a",
    },
    {
      title: "Active Game",
      value: dashboardData.activeGame,
      icon: <FaPlay />,
      route: "/dashboard/active-games",
      themeColor: "#45f82a",
    },
    {
      title: "Inactive Game",
      value: dashboardData.inactiveGame,
      icon: <FaStop />,
      route: "/",
      themeColor: "#45f82a",
    },
    {
      title: "Total Game API",
      value: dashboardData.totalGameApi,
      icon: <FaRobot />,
      route: "/",
      themeColor: "#45f82a",
    },
  ];

  const statsDataForMoneyRow = [
    {
      title: "Total Deposit",
      value: dashboardData.totalDeposit,
      icon: <FaMoneyCheck />,
      route: "/dashboard/DepositHistory",
      themeColor: "#010fe5",
    },
    {
      title: "Today Deposit",
      value: dashboardData.todayDeposit,
      icon: <FaMoneyCheckAlt />,
      route: "/dashboard/DepositHistory",
      themeColor: "#010fe5",
    },
    {
      title: "Total Withdraw",
      value: dashboardData.totalWithdraw,
      icon: <FaMoneyBill />,
      route: "/dashboard/WithdrawalHistory",
      themeColor: "#010fe5",
    },
    {
      title: "Today Withdraw",
      value: dashboardData.todayWithdraw,
      icon: <FaMoneyBillWave />,
      route: "/dashboard/WithdrawalHistory",
      themeColor: "#010fe5",
    },
  ];

  const statsDataForPendingDepositRequestRow = [
    {
      title: "Deposit Request",
      value: dashboardData.pendingDepositRequests,
      icon: <FaClock />,
      route: "/dashboard/DepositHistory",
      themeColor: "#e91e63",
    },
    {
      title: "Withdraw Request",
      value: dashboardData.pendingWithdrawRequests,
      icon: <FaHourglass />,
      route: "/dashboard/WithdrawalHistory",
      themeColor: "#e91e63",
    },
    {
      title: "Affiliate Signup Request",
      value: dashboardData.affiliateSignupRequest,
      icon: <FaUserPlus />,
      route: "/",
      themeColor: "#e91e63",
    },
    {
      title: "Wallet Agent Signup Request",
      value: dashboardData.walletAgentSignupRequest,
      icon: <FaUserFriends />,
      route: "/",
      themeColor: "#e91e63",
    },
  ];

  const handleCardClick = (route) => {
    navigate(route);
  };

  return (
    <div className="p-4">
      <div className="my-3 border-4 border-dotted border-red-500 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsDataForUserRow.map((stat, index) => (
            <StatCard
              key={index}
              themeColor={stat.themeColor}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              onClick={() => handleCardClick(stat.route)}
            />
          ))}
        </div>
      </div>
      <div className="my-3 border-4 border-dotted border-red-500 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsDataForGameRow.map((stat, index) => (
            <StatCard
              key={index}
              themeColor={stat.themeColor}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              onClick={() => handleCardClick(stat.route)}
            />
          ))}
        </div>
      </div>
      <div className="my-3 border-4 border-dotted border-red-500 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsDataForMoneyRow.map((stat, index) => (
            <StatCard
              key={index}
              themeColor={stat.themeColor}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              onClick={() => handleCardClick(stat.route)}
            />
          ))}
        </div>
      </div>
      <div className="my-3 border-4 border-dotted border-red-500 rounded-lg p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {statsDataForPendingDepositRequestRow.map((stat, index) => (
            <StatCard
              key={index}
              themeColor={stat.themeColor}
              title={stat.title}
              value={stat.value}
              icon={stat.icon}
              onClick={() => handleCardClick(stat.route)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
