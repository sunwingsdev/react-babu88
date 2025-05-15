const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (withdrawPaymentMethodCollection) => {
  // Create a new withdraw payment method (POST)
  router.post("/", async (req, res) => {
    try {
      const {
        methodName,
        methodNameBD,
        methodImage,
        gateway = [],
        color = "#000000",
        userInputs = [],
        paymentPageImage = "",
        instruction = "",
        instructionBD = "",
        status = "active",
        backgroundColor = "#ffffff",
        buttonColor = "#000000",
      } = req.body;

      // Validate required fields
      if (
        !methodName ||
        !methodNameBD ||
        !methodImage ||
        !color ||
        !backgroundColor ||
        !buttonColor
      ) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      // Validate userInputs
      for (const input of userInputs) {
        if (!["text", "number", "file"].includes(input.type)) {
          return res.status(400).json({ error: "Invalid user input type" });
        }
        if (!input.name) {
          return res.status(400).json({ error: "User input name is required" });
        }
      }

      // Validate status
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const newMethod = {
        methodName,
        methodNameBD,
        methodImage,
        gateway,
        color,
        userInputs,
        paymentPageImage,
        instruction,
        instructionBD,
        createdAt: new Date(),
        status,
        backgroundColor,
        buttonColor,
      };

      const result = await withdrawPaymentMethodCollection.insertOne(newMethod);
      res.status(201).json({
        message: "Withdraw payment method created",
        data: { insertedId: result.insertedId },
      });
    } catch (err) {
      console.error("Error in POST /withdrawPaymentMethod:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Get all withdraw payment methods (GET)
  router.get("/", async (req, res) => {
    try {
      const methods = await withdrawPaymentMethodCollection.find({}).toArray();
      res.status(200).json(methods);
    } catch (err) {
      console.error("Error in GET /withdrawPaymentMethod:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Get a specific withdraw payment method (GET by ID)
  router.get("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const method = await withdrawPaymentMethodCollection.findOne({ _id: new ObjectId(id) });
      if (!method) {
        return res.status(404).json({ error: "Method not found" });
      }
      res.status(200).json(method);
    } catch (err) {
      console.error("Error in GET /withdrawPaymentMethod/:id:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Update a withdraw payment method (PUT)
  router.put("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const {
        methodName,
        methodNameBD,
        methodImage,
        gateway = [],
        color = "#000000",
        userInputs = [],
        paymentPageImage = "",
        instruction = "",
        instructionBD = "",
        status = "active",
        backgroundColor = "#ffffff",
        buttonColor = "#000000",
      } = req.body;

      // Validate required fields
      if (
        !methodName ||
        !methodNameBD ||
        !methodImage ||
        !color ||
        !backgroundColor ||
        !buttonColor
      ) {
        return res.status(400).json({ error: "Required fields are missing" });
      }

      // Validate userInputs
      for (const input of userInputs) {
        if (!["text", "number", "file"].includes(input.type)) {
          return res.status(400).json({ error: "Invalid user input type" });
        }
        if (!input.name) {
          return res.status(400).json({ error: "User input name is required" });
        }
      }

      // Validate status
      if (!["active", "inactive"].includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      const updatedMethod = {
        methodName,
        methodNameBD,
        methodImage,
        gateway,
        color,
        userInputs,
        paymentPageImage,
        instruction,
        instructionBD,
        status,
        backgroundColor,
        buttonColor,
        updatedAt: new Date(),
      };

      const result = await withdrawPaymentMethodCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: updatedMethod }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Method not found" });
      }

      res.status(200).json({ message: "Withdraw payment method updated" });
    } catch (err) {
      console.error("Error in PUT /withdrawPaymentMethod:", err);
      res.status(500).json({ error: err.message });
    }
  });

  // Delete a withdraw payment method (DELETE)
  router.delete("/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const result = await withdrawPaymentMethodCollection.deleteOne({ _id: new ObjectId(id) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Method not found" });
      }

      res.status(200).json({ message: "Withdraw payment method deleted" });
    } catch (err) {
      console.error("Error in DELETE /withdrawPaymentMethod:", err);
      res.status(500).json({ error: err.message });
    }
  });

  return router;
};