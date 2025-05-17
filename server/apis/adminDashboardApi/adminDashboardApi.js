const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Middleware to verify JWT and admin role (optional)
// const verifyAdminJWT = (req, res, next) => {
//   const authHeader = req.headers.authorization || req.headers.Authorization;
//   if (!authHeader?.startsWith("Bearer ")) {
//     return res.status(401).json({ error: "Unauthorized: No token provided" });
//   }
//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.role !== "admin") {
//       return res.status(403).json({ error: "Forbidden: Admin access required" });
//     }
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.status(403).json({ error: "Forbidden: Invalid token" });
//   }
// };

module.exports = (
  usersCollection,
  gamesCollection,
  depositTransactionsCollection,
  withdrawTransactionsCollection
) => {
  // GET /admin/dashboard
  router.get(
    "/dashboard",
    /* verifyAdminJWT, */ async (req, res) => {
      try {
        // Total Users
        const totalUsers = await usersCollection.countDocuments();

        // Total Games
        const totalGames = await gamesCollection.countDocuments();

        // Active and Inactive Games
        const activeGame = await gamesCollection.countDocuments({
          isActive: true,
        });
        const inactiveGame = await gamesCollection.countDocuments({
          isActive: false,
        });

        // Total Deposit and Today Deposit
        const depositTransactions = await depositTransactionsCollection
          .find()
          .toArray();
        const totalDeposit = depositTransactions
          .filter((t) => t.status === "approved")
          .reduce((sum, t) => {
            let promotionValue = 0;
            if (t.promotionBonus) {
              promotionValue =
                t.promotionBonus.bonus_type === "Fix"
                  ? t.promotionBonus.bonus
                  : (t.amount * t.promotionBonus.bonus) / 100;
            }
            return sum + t.amount + promotionValue;
          }, 0);

        const last24Hours = new Date(Date.now() - 24 * 60 * 60 * 1000);
        const todayDeposit = depositTransactions
          .filter(
            (t) =>
              t.status === "approved" && new Date(t.createdAt) >= last24Hours
          )
          .reduce((sum, t) => {
            let promotionValue = 0;
            if (t.promotionBonus) {
              promotionValue =
                t.promotionBonus.bonus_type === "Fix"
                  ? t.promotionBonus.bonus
                  : (t.amount * t.promotionBonus.bonus) / 100;
            }
            return sum + t.amount + promotionValue;
          }, 0);

        // Total Withdraw and Today Withdraw
        const withdrawTransactions = await withdrawTransactionsCollection
          .find()
          .toArray();
        const totalWithdraw = withdrawTransactions
          .filter((t) => t.status === "completed")
          .reduce((sum, t) => sum + t.amount, 0);

        const todayWithdraw = withdrawTransactions
          .filter(
            (t) =>
              t.status === "completed" && new Date(t.createdAt) >= last24Hours
          )
          .reduce((sum, t) => sum + t.amount, 0);

        // Pending Deposit and Withdraw Requests
        const pendingDepositRequests = depositTransactions.filter(
          (t) => t.status === "pending"
        ).length;
        const pendingWithdrawRequests = withdrawTransactions.filter(
          (t) => t.status === "pending"
        ).length;

        // Static values
        const staticData = {
          totalAffiliator: 0,
          totalWalletAgent: 0,
          totalWhiteLabel: 0,
          totalGameApi: 0,
          affiliateSignupRequest: 0,
          walletAgentSignupRequest: 0,
        };

        // Combine all data
        const dashboardData = {
          totalUsers,
          totalGames,
          activeGame,
          inactiveGame,
          totalDeposit,
          todayDeposit,
          totalWithdraw,
          todayWithdraw,
          pendingDepositRequests,
          pendingWithdrawRequests,
          ...staticData,
        };

        res.status(200).json({ data: dashboardData });
      } catch (err) {
        console.error("Error in GET /admin/dashboard:", err);
        res.status(500).json({ error: err.message || "Server error" });
      }
    }
  );

  return router;
};
