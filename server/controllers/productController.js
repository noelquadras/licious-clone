import Product from "../models/productModel.js";

// Admin or Vendor creates product
export const createProduct = async (req, res) => {
  try {
    const { name, category, description, price, stock, image, vendorId } =
      req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: "Name, category, and price required" });
    }

    const product = await Product.create({
      name,
      category,
      description,
      price,
      stock,
      image,
      vendor: vendorId,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Product created", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("vendor", "storeName ownerName");
    res.json({ products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single product
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate(
      "vendor",
      "storeName ownerName"
    );
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const { name, category, description, price, stock, image, status } = req.body;

    product.name = name || product.name;
    product.category = category || product.category;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.image = image || product.image;
    product.status = status || product.status;

    await product.save();
    res.json({ message: "Product updated", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
