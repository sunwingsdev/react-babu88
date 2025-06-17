const express = require("express");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const themeColorApi = (themeColorCollection) => {
  const router = express.Router();

  // Initialize theme color document
  router.post("/init", async (req, res) => {
    try {
      const existingDoc = await themeColorCollection.findOne();
      if (existingDoc) {
        return res.status(400).json({ error: "Theme color document already exists" });
      }
      const newDoc = {
        mainBackgroundColor: "",
        mainBackgroundTextColor: "",
        secondaryButtonBackgroundColor: "",
        secondaryButtonTextColor: "",
        secondaryColor: "",
        noticeBackgroundColor: "",
        noticeTextColor: "",
        mobileSidebarMenuBackgroundColor: "",
        mobileSidebarMenuTextColor: "",
        mobileSidebarMenuIconColor: "",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const result = await themeColorCollection.insertOne(newDoc);
      res.status(201).json({ message: "Theme color document initialized", id: result.insertedId });
    } catch (err) {
      console.error("Error in POST /theme-color/init:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Get theme colors
  router.get("/", async (req, res) => {
    try {
      const colors = await themeColorCollection.findOne();
      if (!colors) {
        return res.status(404).json({ error: "No colors found" });
      }
      res.status(200).json(colors);
    } catch (err) {
      console.error("Error in GET /theme-color:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Update a specific color
  router.put("/:id", async (req, res) => {
    const { id } = req.params;
    const { field, color } = req.body;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    if (
      ![
        "mainBackgroundColor",
        "mainBackgroundTextColor",
        "secondaryButtonBackgroundColor",
        "secondaryButtonTextColor",
        "secondaryColor",
        "noticeBackgroundColor",
        "noticeTextColor",
        "mobileSidebarMenuBackgroundColor",
        "mobileSidebarMenuTextColor",
        "mobileSidebarMenuIconColor",
      ].includes(field) ||
      !color
    ) {
      return res.status(400).json({ error: "Valid field and color are required" });
    }
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      return res.status(400).json({ error: "Invalid hex color format" });
    }
    try {
      const result = await themeColorCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { [field]: color, updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(200).json({ message: "Color updated successfully" });
    } catch (err) {
      console.error("Error in PUT /theme-color:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  // Delete a specific color (reset to empty)
  router.delete("/:id/:field", async (req, res) => {
    const { id, field } = req.params;
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID format" });
    }
    if (
      ![
        "mainBackgroundColor",
        "mainBackgroundTextColor",
        "secondaryButtonBackgroundColor",
        "secondaryButtonTextColor",
        "secondaryColor",
        "noticeBackgroundColor",
        "noticeTextColor",
        "mobileSidebarMenuBackgroundColor",
        "mobileSidebarMenuTextColor",
        "mobileSidebarMenuIconColor",
      ].includes(field)
    ) {
      return res.status(400).json({ error: "Invalid field" });
    }
    try {
      const result = await themeColorCollection.updateOne(
        { _id: new ObjectId(id) },
        { $set: { [field]: "", updatedAt: new Date() } }
      );
      if (result.matchedCount === 0) {
        return res.status(404).json({ error: "Document not found" });
      }
      res.status(200).json({ message: "Color reset successfully" });
    } catch (err) {
      console.error("Error in DELETE /theme-color:", err);
      res.status(500).json({ error: "Server error" });
    }
  });

  return router;
};

module.exports = themeColorApi;