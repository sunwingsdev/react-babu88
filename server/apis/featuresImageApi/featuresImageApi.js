const express = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const { deleteFile } = require("../../utils");

const featuresImageApi = (featuresImageCollection) => {
  const router = express.Router();


  // Initialize features image document
  router.post("/init", async (req, res) => {
    try {
      const existingDoc = await featuresImageCollection.findOne();
      if (existingDoc) {
        return res.status(400).json({ error: "Features image document already exists" });
      }
      const newDoc = {
        features: "",
        download: "",
        publish: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await featuresImageCollection.insertOne(newDoc);
      res.status(201).json({ message: "Features image document initialized", id: result.insertedId });
    } catch (err) {
      console.error("Error in POST /features-image/init:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get features images
  router.get("/", async (req, res) => {
    try {
      const images = await featuresImageCollection.findOne();
      if (!images) {
        return res.status(404).json({ error: "No images found" });
      }
      res.status(200).json(images);
    } catch (err) {
      console.error("Error in GET /features-image:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Update a specific image
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { field, imageLink } = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    if (!["features", "download", "publish"].includes(field) || !imageLink) {
      return res.status(400).json({ error: "Valid field and image link are required" });
    }
    try {
      const result = await featuresImageCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { [field]: imageLink, updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(200).json({ message: "Image updated successfully" });
    } catch (err) {
      console.error("Error in PUT /features-image:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Delete a specific image
  router.delete("/:id/:field", async (req, res) => {
    const { id, field } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    if (!["features", "download", "publish"].includes(field)) {
      return res.status(400).json({ error: "Invalid field" });
    }
    try {
      const doc = await featuresImageCollection.findOne({ _id: new ObjectId(id) });
      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }
      const imagePath = doc[field];
      if (imagePath) {
        await deleteFile(imagePath);
      }
      const result = await featuresImageCollection.updateOne(
        { _id: new ObjectId(id) },
        { $unset: { [field]: "" }, $set: { updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(200).json({ message: "Image deleted successfully" });
    } catch (err) {
      console.error("Error in DELETE /features-image:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};

module.exports = featuresImageApi;