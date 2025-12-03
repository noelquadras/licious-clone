import express from "express";
import { registerUser, getAllUsers } from "../controllers/userController.js";
import { loginUser } from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getAllUsers);

// Test protected user route
router.get("/me", protect, (req, res) => {
  res.json({ message: "Protected route accessed", user: req.user });
});

// Test admin-only route
router.get("/admin-only", protect, authorizeRoles("admin"), (req, res) => {
  res.json({ message: "Admin route accessed" });
});

export default router;
