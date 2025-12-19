import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { getAllUsers, getCurrentUser, updateUserLocation } from "../controllers/userController.js";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Authentication routes (now in authController)
router.post("/register", registerUser);
router.post("/login", loginUser);

// User profile routes
router.get("/me", protect, authorizeRoles("user"), getCurrentUser);
router.put("/location", protect, authorizeRoles("user"), updateUserLocation);

// Admin routes
router.get("/", protect, authorizeRoles("admin"), getAllUsers);

export default router;
