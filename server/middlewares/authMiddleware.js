// import jwt from "jsonwebtoken";
// import User from "../models/userModel.js";

// // Verify JWT Token
// export const protect = async (req, res, next) => {
//   let token;

//   if (
//     req.headers.authorization &&
//     req.headers.authorization.startsWith("Bearer")
//   ) {
//     try {
//       token = req.headers.authorization.split(" ")[1];

//       const decoded = jwt.verify(token, process.env.JWT_SECRET);

//       req.user = await User.findById(decoded.id).select("-password");

//       next();
//     } catch (error) {
//       console.error(error);
//       return res.status(401).json({ message: "Invalid or expired token" });
//     }
//   }

//   if (!token) {
//     return res.status(401).json({ message: "Not authorized, token missing" });
//   }
// };









// // Allow only specific roles
// export const authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: `Access denied: Only ${roles.join(", ")} can perform this action`,
//       });
//     }
//     next();
//   };
// };







// export const isDelivery = (req, res, next) => {
//   try {
//     if (req.user.role !== "delivery")
//       return res.status(403).send({ message: "Access denied" });

//     next();
//   } catch (error) {
//     res.status(500).send({ message: "Auth error" });
//   }
// };




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

      if (!req.user) {
        return res.status(401).json({ message: "User no longer exists" });
      }

      return next();   // <-- IMPORTANT FIX
    } catch (error) {
      console.error(error);
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  }

  // If token never existed
  return res.status(401).json({ message: "Not authorized, token missing" });
};



// Allow only specific roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

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
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (req.user.role !== "delivery")
      return res.status(403).send({ message: "Access denied" });

    next();
  } catch (error) {
    res.status(500).send({ message: "Auth error" });
  }
};

// Optional protect - sets req.user if token is provided, but doesn't fail if no token
export const optionalProtect = async (req, res, next) => {
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      
      if (!req.user) {
        // User doesn't exist, but we'll continue without setting req.user
        req.user = null;
      }
    } catch (error) {
      // Invalid token, but we'll continue without setting req.user
      req.user = null;
    }
  }
  
  next();
};