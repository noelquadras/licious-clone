import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();

// Public route
router.get("/", getAllProducts);
router.get("/:id", getProductById);

// Protected routes
router.post("/", protect, authorizeRoles("admin", "vendor"), createProduct);
router.put("/:id", protect, authorizeRoles("admin", "vendor"), updateProduct);
router.delete("/:id", protect, authorizeRoles("admin", "vendor"), deleteProduct);

export default router;
