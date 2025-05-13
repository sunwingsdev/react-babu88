const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");
const { upload } = require("../../utils");

module.exports = (depositTransactionsCollection, usersCollection, depositPaymentMethodCollection, depositPromotionsCollection) => {
 // Create a new deposit transaction
  router.post("/create", upload.fields([{ name: "userInputs[file]", maxCount: 1 }]), async (req, res) => {
    try {
      // req.body থেকে টেক্সট ডেটা এবং req.files থেকে ফাইল ডেটা নেওয়া হচ্ছে
      const { userId, paymentMethodId, amount, promotionId } = req.body;
      let userInputs = {};

      console.log("this is roni -> ", req.body);

      // userInputs পার্স করা
      if (req.body.userInputs && typeof req.body.userInputs === "object") {
        userInputs = { ...req.body.userInputs }; // নেস্টেড userInputs অবজেক্ট কপি করা
      }

      // ফাইল যোগ করা (যদি থাকে)
      if (req.files && req.files["userInputs[file]"]) {
        const file = req.files["userInputs[file]"][0];
        userInputs["file"] = `/uploads/images/${file.filename}`;
      }

      // Validate inputs
      if (!userId || !paymentMethodId || !amount || isNaN(amount) || amount < 200) {
        return res.status(400).json({ error: "Invalid or missing required fields" });
      }

      // Validate user
      const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Validate payment method
      const paymentMethod = await depositPaymentMethodCollection.findOne({ _id: new ObjectId(paymentMethodId) });
      if (!paymentMethod) {
        return res.status(404).json({ error: "Payment method not found" });
      }

      // Validate promotion (if provided)
      let promotion = null;
      if (promotionId) {
        promotion = await depositPromotionsCollection.findOne({ _id: new ObjectId(promotionId) });
        if (!promotion) {
          return res.status(404).json({ error: "Promotion not found" });
        }
      }

      console.log("this is promotion -> ", promotion);

      // Generate unique transaction ID
      const transactionId = `D${Date.now()}${Math.floor(Math.random() * 10000)}`;

      // Prepare transaction document
      const transaction = {
        userId: new ObjectId(userId),
        paymentMethod: {
          _id: paymentMethod._id,
          methodNameBD: paymentMethod.methodNameBD,
          agentWalletNumber: paymentMethod.agentWalletNumber,
          gateway: paymentMethod.gateway,
          userInputs: paymentMethod.userInputs,
        },
        promotion: promotion
          ? {
              _id: promotion._id,
              title_bd: promotion.title_bd,
              bonus_type:
                promotion.promotion_bonuses?.find(
                  (bonus) =>
                    bonus.payment_method &&
                    bonus.payment_method.toString() === paymentMethodId
                )?.bonus_type || null,
              bonus:
                promotion.promotion_bonuses?.find(
                  (bonus) =>
                    bonus.payment_method &&
                    bonus.payment_method.toString() === paymentMethodId
                )?.bonus || null,
            }
          : null,
        amount: parseFloat(amount),
        transactionId,
        userInputs: userInputs || {},
        status: "pending",
        createdAt: new Date(),
      };

      // Insert transaction into depositTransactions collection
      const result = await depositTransactionsCollection.insertOne(transaction);

      console.log("this is result -> ", result);

      res.status(201).json({
        message: "Deposit transaction created successfully",
        data: {
          _id: result.insertedId,
          transactionId,
          amount,
          status: "pending",
          createdAt: transaction.createdAt,
        },
      });
    } catch (error) {
      console.error("Error creating deposit transaction:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  return router;
};