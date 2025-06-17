const express = require("express");
const { ObjectId } = require("mongodb");
const { deleteFile } = require("../../utils");

const categoriesApi = (categoriesCollection) => {
  const router = express.Router();

  // Add a category data
  router.post("/", async (req, res) => {
    const categoryInfo = req.body;
    categoryInfo.createdAt = new Date();
    // Validate required fields
    if (!categoryInfo.image || !categoryInfo.category || !categoryInfo.value || !categoryInfo.title) {
      return res.status(400).json({ message: "Required fields are missing" });
    }
    const result = await categoriesCollection.insertOne(categoryInfo);
    res.send(result);
  });

  // Get all category data
  router.get("/", async (req, res) => {
    const result = await categoriesCollection.find().toArray();
    res.send(result);
  });

  // Update a category
  router.patch("/:id", async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const query = { _id: new ObjectId(id) };

    try {
      const category = await categoriesCollection.findOne(query);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Only update provided fields
      const updateFields = {};
      if (updateData.image) updateFields.image = updateData.image;
      if (updateData.iconImage) updateFields.iconImage = updateData.iconImage;
      if (updateData.category) updateFields.category = updateData.category;
      if (updateData.value) updateFields.value = updateData.value;
      if (updateData.title) updateFields.title = updateData.title;

      // If no fields to update, return early
      if (Object.keys(updateFields).length === 0) {
        return res.status(400).json({ message: "No valid fields provided for update" });
      }

      const result = await categoriesCollection.updateOne(query, { $set: updateFields });
      if (result.modifiedCount === 0) {
        return res.status(400).json({ message: "No changes made to the category" });
      }
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error: " + err.message });
    }
  });

  // Delete a category
  router.delete("/:id", async (req, res) => {
    const { id } = req.params;

    // Validate ObjectId
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category ID" });
    }

    const query = { _id: new ObjectId(id) };
    const category = await categoriesCollection.findOne(query);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    try {
      // Delete both image and iconImage files
      if (category.image) await deleteFile(category.image);
      if (category.iconImage) await deleteFile(category.iconImage);

      const result = await categoriesCollection.deleteOne(query);
      res.send(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error: " + err.message });
    }
  });

  return router;
};

module.exports = categoriesApi;