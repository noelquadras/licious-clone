import mongoose from "mongoose";



import bcrypt from "bcryptjs";



const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["user", "admin", "vendor", "delivery"],
      default: "user",
    },
    phone: {
      type: String,
    },
    address: {
      type: String,
    }
  },
  { timestamps: true }
);





// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});





export default mongoose.model("User", userSchema);
