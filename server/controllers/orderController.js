import Order from "../models/orderModel.js";
import Cart from "../models/cartModel.js";
// import Product from "../models/productModel.js";
// import Vendor from "../models/vendorModel.js";
import { clearCart } from "./cartController.js";

// ---------------------------------------------
// 1. PLACE ORDER (User)
// ---------------------------------------------
export const placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // Prepare order items
    const orderItems = cart.items.map((item) => ({
      product: item.product._id,
      quantity: item.quantity,
      vendor: item.product.vendor, // comes from Product model
    }));

    // Calculate total price
    const totalPrice = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    // Create the order
    const order = await Order.create({
      user: userId,
      products: orderItems,
      totalPrice,
    });

    // Clear cart after successful order
    await clearCart(userId);

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------
// 2. GET USER ORDERS (User)
// ---------------------------------------------
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("products.product", "name price image")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------
// 3. GET ALL ORDERS (ADMIN)
// ---------------------------------------------
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("products.product", "name")
      .sort({ createdAt: -1 });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------
// 4. GET VENDOR ORDERS (Vendor)
// ---------------------------------------------
export const getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const orders = await Order.find({
      "products.vendor": vendorId,
    })
      .populate("user", "name email")
      .populate("products.product", "name price");

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ---------------------------------------------
// 5. UPDATE ORDER STATUS (Admin / Delivery)
// ---------------------------------------------
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;

    const allowedStatus = [
      "pending",
      "confirmed",
      "out-for-delivery",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
