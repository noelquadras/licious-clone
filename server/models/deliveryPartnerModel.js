import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const deliveryPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allows multiple null values
    },
    password: {
      type: String,
    },
    phone: {
      type: String,
    },
    vehicleType: {
      type: String,
    },
    vehicleNumber: {
      type: String,
    },
    assignedOrders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving (only if password is provided)
deliveryPartnerSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

export default mongoose.model("DeliveryPartner", deliveryPartnerSchema);
