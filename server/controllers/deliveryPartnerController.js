// import DeliveryPartner from "../models/deliveryPartnerModel.js";
// import Order from "../models/orderModel.js";
// import JWT from "jsonwebtoken";
// import bcrypt from "bcryptjs";


// // REGISTER DELIVERY PARTNER (ADMIN ONLY)
// export const registerDeliveryPartnerController = async (req, res) => {
//   try {
//     const { name, email, password, phone, vehicleNumber } = req.body;

//     const exists = await DeliveryPartner.findOne({ email });
//     if (exists)
//       return res.status(400).send({ message: "Email already exists" });

//     const partner = new DeliveryPartner({
//       name,
//       email,
//       password,
//       phone,
//       vehicleNumber,
//     });

//     await partner.save();

//     res.status(201).send({
//       success: true,
//       message: "Delivery partner registered successfully",
//       partner,
//     });
//   } catch (error) {
//     res.status(500).send({ success: false, message: error.message });
//   }
// };


// // LOGIN DELIVERY PARTNER
// export const deliveryPartnerLoginController = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const partner = await DeliveryPartner.findOne({ email });
//     if (!partner)
//       return res.status(404).send({ message: "No delivery partner found" });

//     const match = await bcrypt.compare(password, partner.password);
//     if (!match) return res.status(400).send({ message: "Invalid password" });

//     const token = JWT.sign(
//       { id: partner._id, role: "delivery" },
//       process.env.JWT_SECRET,
//       { expiresIn: "7d" }
//     );

//     res.send({
//       success: true,
//       message: "Login success",
//       token,
//       partner,
//     });
//   } catch (error) {
//     res.status(500).send({ success: false, message: error.message });
//   }
// };


// // GET ASSIGNED ORDERS
// export const getAssignedOrdersController = async (req, res) => {
//   try {
//     const orders = await Order.find({ deliveryPartner: req.user.id })
//       .populate("user", "name email phone")
//       .populate("cart");

//     res.send({
//       success: true,
//       message: "Assigned orders fetched",
//       orders,
//     });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };


// // UPDATE ORDER STATUS
// export const updateDeliveryStatusController = async (req, res) => {
//   try {
//     const { orderId } = req.params;
//     const { status } = req.body;

//     const allowedStatus = ["Out For Delivery", "Delivered"];

//     if (!allowedStatus.includes(status))
//       return res.status(400).send({ message: "Invalid status update" });

//     const order = await Order.findById(orderId);
//     if (!order)
//       return res.status(404).send({ message: "Order not found" });

//     if (order.deliveryPartner.toString() !== req.user.id)
//       return res.status(403).send({ message: "Not authorized" });

//     order.status = status;
//     await order.save();

//     res.send({
//       success: true,
//       message: "Order status updated",
//       order,
//     });
//   } catch (error) {
//     res.status(500).send({ message: error.message });
//   }
// };





import DeliveryPartner from "../models/deliveryPartnerModel.js";
import Order from "../models/orderModel.js";

/**
 * Register Delivery Partner (Admin-only)
 * Optionally accepts userId to link to a User account
 */
export const registerDeliveryPartner = async (req, res) => {
  try {
    const { name, phone, vehicleType, userId } = req.body;

    if (!name || !phone || !vehicleType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await DeliveryPartner.findOne({ phone });
    if (exists) return res.status(400).json({ message: "Partner already exists" });

    // If userId is provided, check if it's already linked to another partner
    if (userId) {
      const existingLink = await DeliveryPartner.findOne({ userId });
      if (existingLink) {
        return res.status(400).json({ message: "User is already linked to another delivery partner" });
      }
    }

    const deliveryPartner = await DeliveryPartner.create({
      name,
      phone,
      vehicleType,
      userId: userId || null,
      assignedOrders: [],
    });

    res.status(201).json({
      message: "Delivery partner registered successfully",
      deliveryPartner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * Assign delivery partner to an order
 */
export const assignDeliveryPartner = async (req, res) => {
  try {
    const { orderId, partnerId } = req.body;

    if (!orderId || !partnerId) {
      return res.status(400).json({ message: "orderId and partnerId required" });
    }

    const order = await Order.findById(orderId);
    const partner = await DeliveryPartner.findById(partnerId);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!partner)
      return res.status(404).json({ message: "Delivery partner not found" });

    // Update order
    order.deliveryBy = partnerId;
    order.status = "out-for-delivery";
    await order.save();

    // Add order to partner assigned list
    partner.assignedOrders.push(orderId);
    await partner.save();

    res.json({
      message: "Delivery partner assigned successfully",
      order,
      partner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * Delivery Partner Updates Order Status
 * Can be called by admin (with auth token) or by providing deliveryPartnerId in body
 */
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, status, deliveryPartnerId } = req.body;

    if (!orderId || !status) {
      return res.status(400).json({ message: "orderId and status are required" });
    }

    const validStatuses = ["out-for-delivery", "delivered", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update" });
    }

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Check if user is admin (optional auth)
    const isAdmin = req.user && req.user.role === "admin";

    // If not admin, verify deliveryPartnerId matches the order's deliveryBy
    if (!isAdmin) {
      if (!deliveryPartnerId) {
        return res.status(400).json({ message: "deliveryPartnerId is required when not authenticated as admin" });
      }

      if (!order.deliveryBy) {
        return res.status(403).json({ message: "No delivery partner assigned to this order" });
      }

      if (order.deliveryBy.toString() !== deliveryPartnerId.toString()) {
        return res.status(403).json({ message: "Not authorized for this order" });
      }
        }

    // Update status
    order.status = status;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


/**
 * Link User account to DeliveryPartner
 */
export const linkUserToPartner = async (req, res) => {
  try {
    const { partnerId } = req.body;

    if (!partnerId) {
      return res.status(400).json({ message: "partnerId is required" });
    }

    const deliveryPartner = await DeliveryPartner.findById(partnerId);
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner not found" });
    }

    // Check if userId is already set
    if (deliveryPartner.userId) {
      return res.status(400).json({ message: "Delivery partner is already linked to a user" });
    }

    // Check if this user is already linked to another partner
    const existingLink = await DeliveryPartner.findOne({ userId: req.user._id });
    if (existingLink) {
      return res.status(400).json({ message: "User is already linked to another delivery partner" });
    }

    // Link the user
    deliveryPartner.userId = req.user._id;
    await deliveryPartner.save();

    res.json({
      message: "User linked to delivery partner successfully",
      deliveryPartner,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * View all orders assigned to a delivery partner
 */
export const getAssignedOrders = async (req, res) => {
  try {
    // Find the DeliveryPartner linked to this User
    const deliveryPartner = await DeliveryPartner.findOne({ userId: req.user._id });
    
    if (!deliveryPartner) {
      return res.status(404).json({ message: "Delivery partner profile not found for this user. Please link your account to a delivery partner." });
    }

    // Query orders assigned to this DeliveryPartner
    const orders = await Order.find({ deliveryBy: deliveryPartner._id })
      .populate("user", "name email")
      .populate("products.product", "name price image")
      .populate("products.vendor", "name");

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
