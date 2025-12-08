import mongoose from "mongoose";

// Base products created by admin - catalog items
const baseProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: "",
    },
    basePrice: {
      type: Number,
      required: true, // Suggested price, vendors can set their own
    },
    images: [
      {
        type: String, // URLs to product images
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

export default mongoose.model("BaseProduct", baseProductSchema);

