import Cart from "../models/cartModel.js";
import Product from "../models/productModel.js";

// Get user cart
export const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      "items.product",
      "name price image"
    );
    res.json({ cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add product to cart
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || !quantity)
      return res.status(400).json({ message: "Product and quantity required" });

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [{ product: productId, quantity }],
      });
    } else {
      const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        // Update quantity if product already in cart
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }
      await cart.save();
    }

    res.json({ message: "Product added to cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove product from cart
export const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.json({ message: "Product removed from cart", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart after order
export const clearCart = async (userId) => {
  try {
    await Cart.findOneAndDelete({ user: userId });
  } catch (error) {
    console.log("Error clearing cart:", error.message);
  }
};
