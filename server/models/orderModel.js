import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        vendor: { type: mongoose.Schema.Types.ObjectId, ref: "Vendor" },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "confirmed", "out-for-delivery", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // delivery partner
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
