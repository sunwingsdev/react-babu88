const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (depositTransactionsCollection, usersCollection, depositPaymentMethodCollection, depositPromotionsCollection) => {
  // Create a new deposit transaction
  router.post("/create", async (req, res) => {
    try {
      // req.body থেকে টেক্সট ডেটা নেওয়া হচ্ছে
      const { userId, paymentMethodId, amount, promotionId , gateways } = req.body;
      let userInputs = {};

      console.log("this is roni -> ", req.body);

      // userInputs পার্স করা
      if (req.body.userInputs && typeof req.body.userInputs === "object") {
        for (const [key, value] of Object.entries(req.body.userInputs)) {
          try {
            userInputs[key] = JSON.parse(value); // JSON স্ট্রিং পার্স করা
          } catch (error) {
            userInputs[key] = value; // যদি JSON না হয়, তাহলে সরাসরি ভ্যালু সেট করা
          }
        }
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
        id: new ObjectId().toString(), // নতুন ID জেনারেট করা
        userId: new ObjectId(userId),
        paymentMethod: {
          id: paymentMethod._id.toString(),
          methodNameBD: paymentMethod.methodNameBD,
          agentWalletNumber: paymentMethod.agentWalletNumber,
          gateways: paymentMethod.gateway, // gateway কে gateways হিসেবে সেট করা
          userInputs: paymentMethod.userInputs,
        },
        gateways: gateways,
        promotion: promotion
          ? {
              id: promotion._id.toString(),
              titleBD: promotion.title_bd,
              bonusType: promotion.promotion_bonuses?.find(
                (bonus) =>
                  bonus.payment_method &&
                  bonus.payment_method.toString() === paymentMethodId
              )?.bonus_type || null,
              bonus: promotion.promotion_bonuses?.find(
                (bonus) =>
                  bonus.payment_method &&
                  bonus.payment_method.toString() === paymentMethodId
              )?.bonus || null,
            }
          : null,
        amount: parseFloat(amount),
        userInputs,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      // Insert transaction into depositTransactions collection
      const result = await depositTransactionsCollection.insertOne(transaction);

      console.log("this is result -> ", result);

      res.status(201).json({
        message: "Deposit transaction created successfully",
        data: {
          id: transaction.id,
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