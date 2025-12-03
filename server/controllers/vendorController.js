import Vendor from "../models/vendorModel.js";

// Admin creates a new vendor
export const createVendor = async (req, res) => {
  try {
    const { storeName, ownerName, email, phone, documents } = req.body;

    // Check required fields
    if (!storeName || !ownerName || !email || !phone) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if vendor email already exists
    const existingVendor = await Vendor.findOne({ email });
    if (existingVendor) {
      return res.status(400).json({ message: "Vendor already exists" });
    }

    const vendor = await Vendor.create({
      storeName,
      ownerName,
      email,
      phone,
      documents,
      createdBy: req.user._id, // Admin ID
    });

    res.status(201).json({
      message: "Vendor created successfully",
      vendor,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin updates vendor status (approve/reject)
export const updateVendorStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // status = approved/rejected

    const vendor = await Vendor.findById(id);
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    vendor.status = status;
    await vendor.save();

    res.json({ message: "Vendor status updated", vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Vendor gets own profile
export const getVendorProfile = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ email: req.user.email });
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    res.json({ vendor });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all vendors (Admin)
export const getAllVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find();
    res.json({ vendors });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};






export const vendorDashboard = (req, res) => {
  res.json({
    message: "Welcome Vendor",
    user: req.user
  });
};

export const vendorInventory = (req, res) => {
  res.json({ message: "Vendor inventory will appear here" });
};
