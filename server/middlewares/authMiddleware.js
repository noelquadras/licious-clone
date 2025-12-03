import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

// Verify JWT Token
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, token missing" });
  }
};









// Allow only specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied: Only ${roles.join(", ")} can perform this action`,
      });
    }
    next();
  };
};







export const isDelivery = (req, res, next) => {
  try {
    if (req.user.role !== "delivery")
      return res.status(403).send({ message: "Access denied" });

    next();
  } catch (error) {
    res.status(500).send({ message: "Auth error" });
  }
};
