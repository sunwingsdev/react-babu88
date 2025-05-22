const express = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { upload, deleteFile } = require("../../utils");

// Multer storage for APK files
const apkStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "../../Uploads/apks");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = new Date().toISOString().replace(/:/g, "-");
    const originalName = file.originalname.replace(/\s/g, "_");
    cb(null, `${timestamp}_${originalName}`);
  },
});

// Multer instance for APK uploads
const uploadApk = multer({
  storage: apkStorage,
  fileFilter: (req, file, cb) => {
    const filetypes = /apk/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error("APK files only!"));
    }
  },
});

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
        downloadApk: "",
        publish: "",
        desktop: "",
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

  // Upload image
  router.post("/upload", upload.single("image"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }
    res.status(200).json({
      message: "Image uploaded successfully",
      filePath: `/Uploads/images/${req.file.filename}`,
    });
  });

  // Upload APK
  router.post("/upload-apk", uploadApk.single("apk"), async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No APK file uploaded" });
    }
    const filePath = `/Uploads/apks/${req.file.filename}`;
    res.status(200).json({
      message: "APK uploaded successfully",
      filePath,
    });
  });

  // Update a specific image or APK
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { field, fileLink } = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    if (!["features", "download", "downloadApk", "publish", "desktop"].includes(field) || !fileLink) {
      return res.status(400).json({ error: "Valid field and file link are required" });
    }
    try {
      const result = await featuresImageCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { [field]: fileLink, updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(200).json({ message: `${field === "downloadApk" ? "APK" : "Image"} updated successfully` });
    } catch (err) {
      console.error("Error in PUT /features-image:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Delete a specific image or APK
  router.delete("/:id/:field", async (req, res) => {
    const { id, field } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    if (!["features", "download", "downloadApk", "publish", "desktop"].includes(field)) {
      return res.status(400).json({ error: "Invalid field" });
    }
    try {
      const doc = await featuresImageCollection.findOne({ _id: new ObjectId(id) });
      if (!doc) {
        return res.status(404).json({ error: "Document not found" });
      }
      const filePath = doc[field];
      if (filePath) {
        await deleteFile(filePath);
      }
      const result = await featuresImageCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { [field]: "", updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(200).json({ message: `${field === "downloadApk" ? "APK" : "Image"} deleted successfully` });
    } catch (err) {
      console.error("Error in DELETE /features-image:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};

module.exports = featuresImageApi;