const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (depositTransactionsCollection, usersCollection, depositPaymentMethodCollection, depositPromotionsCollection) => {
  // Get all deposit transactions with user details
  router.get("/", async (req, res) => {
    try {
      const transactions = await depositTransactionsCollection
        .aggregate([
          {
            $lookup: {
              from: "users",
              localField: "userId",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: {
              path: "$user",
              preserveNullAndEmptyArrays: true,
            },
          },
          {
            $project: {
              id: 1,
              transactionId: 1,
              userId: 1,
              "user.username": 1,
              "user.number": 1,
              paymentMethod: 1,
              promotion: 1,
              amount: 1,
              userInputs: 1,
              status: 1,
              reason: 1,
              createdAt: 1,
            },
          },
          {
            $sort: { createdAt: -1 },
          },
        ])
        .toArray();

      res.status(200).json({
        message: "Deposit transactions fetched successfully",
        data: transactions,
      });
    } catch (error) {
      console.error("Error fetching deposit transactions:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update a deposit transaction
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const { amount, status, reason } = req.body;

      // Validate inputs
      if (!amount || isNaN(amount) || amount < 200) {
        return res.status(400).json({ error: "Amount must be a valid number and at least 200" });
      }
      if (!["pending", "approved", "rejected"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }

      // Check current transaction status
      const transaction = await depositTransactionsCollection.findOne({ id });
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      if (transaction.status === "approved") {
        return res.status(400).json({ error: "Approved transactions cannot be updated" });
      }

      // Validate reason for rejection
      if (status === "rejected" && (!reason || !reason.trim())) {
        return res.status(400).json({ error: "Reason is required for rejection" });
      }

      // Prepare update object
      const updateData = {
        amount: parseFloat(amount),
        status,
        reason: status === "rejected" ? reason : "",
      };

      // If status is approved, update user's balance and deposit
      if (status === "approved") {
        const user = await usersCollection.findOne({ _id: new ObjectId(transaction.userId) });
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Calculate promotion bonus
        let bonusAmount = 0;
        if (transaction.promotion) {
          const { bonusType, bonus } = transaction.promotion;
          bonusAmount = bonusType === "Percentage" ? amount * (bonus / 100) : bonus;
        }

        // Update user's balance and deposit
        await usersCollection.updateOne(
          { _id: new ObjectId(transaction.userId) },
          {
            $inc: {
              balance: parseFloat(amount) + bonusAmount,
              deposit: parseFloat(amount),
            },
          }
        );
      }

      // Update transaction
      const result = await depositTransactionsCollection.updateOne(
        { id },
        { $set: updateData }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      res.status(200).json({
        message: "Transaction updated successfully",
      });
    } catch (error) {
      console.error("Error updating deposit transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete a deposit transaction
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;

      // Check current transaction status
      const transaction = await depositTransactionsCollection.findOne({ id });
      if (!transaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }
      if (transaction.status === "approved") {
        return res.status(400).json({ error: "Approved transactions cannot be deleted" });
      }

      const result = await depositTransactionsCollection.deleteOne({ id });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      res.status(200).json({
        message: "Transaction deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting deposit transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  return router;
};