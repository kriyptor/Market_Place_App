const mongoose = require("mongoose");
const { Order } = require(`../models/order-model`);

/*------------ Get User Order -------------*/

exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;
    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({ success: false, error: "Invalid user ID format" });
    }

    const page = parseInt(req.query.page) || 1;
    const limitPointer = parseInt(req.query.limit) || 15;
    const skipPointer = (page - 1) * limitPointer;

    const allOrderData = await Order.find({ buyerId: userId })
      .sort({ createdAt: -1 })
      .skip(skipPointer)
      .limit(limitPointer);

    const totalOrder = await Order.countDocuments({ buyerId: userId });

    res.status(200).json({
      success: true,
      data: allOrderData,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalOrder / limitPointer),
        totalOrder,
        hasNextPage: page < Math.ceil(totalOrder / limitPointer),
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Validation failed", error: error.message });
    }
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};

/*------------ Get Vendor Order -------------*/

exports.getVendorOrders = async (req, res) => {
  try {
    const vendorId = req.user._id;
    if (!mongoose.isValidObjectId(vendorId)) {
      return res.status(400).json({ success: false, error: "Invalid vendor ID format" });
    }

    const page = parseInt(req.query.page) || 1;
    const limitPointer = parseInt(req.query.limit) || 15;
    const skipPointer = (page - 1) * limitPointer;

    const allOrderData = await Order.find({ "items.vendorId": vendorId })
      .sort({ createdAt: -1 })
      .skip(skipPointer)
      .limit(limitPointer);

    const totalOrder = await Order.countDocuments({ "items.vendorId": vendorId });

    res.status(200).json({
      success: true,
      data: allOrderData,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalOrder / limitPointer),
        totalOrder,
        hasNextPage: page < Math.ceil(totalOrder / limitPointer),
        hasPrevPage: page > 1,
      },
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Validation failed", error: error.message });
    }
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};