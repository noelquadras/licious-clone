import express from "express";
import {
  registerDeliveryPartner,
  assignDeliveryPartner,
  updateDeliveryStatus,
  getAssignedOrders,
  linkUserToPartner
} from "../controllers/deliveryPartnerController.js";

import { protect, authorizeRoles, optionalProtect } from "../middlewares/authMiddleware.js";

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
 * Can be called by admin (with auth) or with deliveryPartnerId in body
 */
router.put(
  "/update-status",
  optionalProtect,
  updateDeliveryStatus
);

/**
 * Link User account to DeliveryPartner (for delivery users)
 */
router.post(
  "/link-user",
  protect,
  authorizeRoles("delivery"),
  linkUserToPartner
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
