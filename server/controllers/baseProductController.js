import BaseProduct from "../models/baseProductModel.js";
import { uploadMultiple } from "../utils/upload.js";

// Admin creates base product (catalog item)
export const createBaseProduct = async (req, res) => {
  try {
    const { name, category, description, basePrice } = req.body;

    if (!name || !category || !basePrice) {
      return res.status(400).json({ message: "Name, category, and basePrice are required" });
    }

    // Handle image uploads
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        images.push(`/uploads/${file.filename}`);
      });
    }

    const baseProduct = await BaseProduct.create({
      name,
      category,
      description,
      basePrice: parseFloat(basePrice),
      images,
      createdBy: req.user._id, // Admin ID
    });

    res.status(201).json({
      message: "Base product created successfully",
      baseProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all base products (public)
export const getAllBaseProducts = async (req, res) => {
  try {
    const { category, status } = req.query;
    const query = {};

    if (category) query.category = category;
    if (status) query.status = status;

    const baseProducts = await BaseProduct.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json({ baseProducts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get base product by ID
export const getBaseProductById = async (req, res) => {
  try {
    const baseProduct = await BaseProduct.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!baseProduct) {
      return res.status(404).json({ message: "Base product not found" });
    }

    res.json({ baseProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin updates base product
export const updateBaseProduct = async (req, res) => {
  try {
    const { name, category, description, basePrice, status } = req.body;
    const baseProduct = await BaseProduct.findById(req.params.id);

    if (!baseProduct) {
      return res.status(404).json({ message: "Base product not found" });
    }

    if (name) baseProduct.name = name;
    if (category) baseProduct.category = category;
    if (description !== undefined) baseProduct.description = description;
    if (basePrice) baseProduct.basePrice = parseFloat(basePrice);
    if (status) baseProduct.status = status;

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      req.files.forEach((file) => {
        baseProduct.images.push(`/uploads/${file.filename}`);
      });
    }

    await baseProduct.save();

    res.json({
      message: "Base product updated successfully",
      baseProduct,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin deletes base product
export const deleteBaseProduct = async (req, res) => {
  try {
    const baseProduct = await BaseProduct.findById(req.params.id);

    if (!baseProduct) {
      return res.status(404).json({ message: "Base product not found" });
    }

    await baseProduct.deleteOne();

    res.json({ message: "Base product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Export upload middleware
export { uploadMultiple as uploadBaseProductImages };

