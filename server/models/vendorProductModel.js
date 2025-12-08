import mongoose from "mongoose";

// Vendor's inventory items - based on BaseProduct
const vendorProductSchema = new mongoose.Schema(
  {
    baseProduct: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "BaseProduct",
      required: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    images: [
      {
        type: String, // Vendor-specific product images
      },
    ],
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
    },
    status: {
      type: String,
      enum: ["active", "out-of-stock", "inactive"],
      default: "active",
    },
  },
  { timestamps: true }
);

// Compound index to ensure vendor can't add same base product twice
vendorProductSchema.index({ vendor: 1, baseProduct: 1 }, { unique: true });

export default mongoose.model("VendorProduct", vendorProductSchema);

