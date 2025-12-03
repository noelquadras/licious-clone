import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { deliveryDashboard, deliveryTasks } from "../controllers/deliveryController.js";

const router = express.Router();

router.get("/dashboard", protect, authorizeRoles("delivery"), deliveryDashboard);
router.get("/tasks", protect, authorizeRoles("delivery"), deliveryTasks);

export default router;
