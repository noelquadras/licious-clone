import express from "express";
import {
  registerDeliveryPartner,
  assignDeliveryPartner,
  updateDeliveryStatus,
  getAssignedOrders
} from "../controllers/deliveryPartnerController.js";

import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = express.Router();

/**
 * Admin registers new delivery partner
 */
router.post(
  "/register",
  protect,
  authorizeRoles("admin"),
  registerDeliveryPartner
);

/**
 * Admin assigns delivery partner to an order
 */
router.post(
  "/assign",
  protect,
  authorizeRoles("admin"),
  assignDeliveryPartner
);

/**
 * Delivery partner updates delivery status
 * (Requires login as delivery partner)
 */
router.put(
  "/update-status",
  protect,
  authorizeRoles("delivery"),
  updateDeliveryStatus
);

/**
 * Delivery partner views all assigned orders
 */
router.get(
  "/my-orders",
  protect,
  authorizeRoles("delivery"),
  getAssignedOrders
);

export default router;
