const mongoose = require("mongoose");
const { Product } = require("../models/product-model");

/* ----- Get All Products ------ */
exports.getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limitPointer = parseInt(req.query.limit) || 15;
    const skipPointer = (page - 1) * limitPointer;

    const allProductData = await Product.find({})
      .sort({ createdAt: -1 })
      .skip(skipPointer)
      .limit(limitPointer);

    const totalProducts = await Product.countDocuments();

    res.status(200).json({
      success: true,
      data: allProductData,
      pagination: {
        currentPage: page,
        totalPage: Math.ceil(totalProducts / limitPointer),
        totalProducts,
        hasNextPage: page < Math.ceil(totalProducts / limitPointer),
        hasPrevPage: page > 1,
      },
    });
  } catch (error) {
    console.log(`Error fetching products: ${error}`);
    res
      .status(500)
      .json({ success: false, message: "Error fetching products" });
  }
};

/* ----- Get Single Product ------ */
exports.getSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.isValidObjectId(productId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid product ID format" });
    }

    const singleProduct = await Product.findById(productId);

    if (!singleProduct) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Success",
      data: singleProduct,
    });
  } catch (error) {
    console.log(`Error fetching product: ${error}`);
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
};

/* -------- Create Product --------- */
exports.createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      brand,
      stockQuantity,
      images,
      vendorId,
      vendorName,
      averageRating,
      totalReviews,
    } = req.body;

    // Validate required fields
    if (!name || !price || !category || !vendorId || !vendorName) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing!",
      });
    }

    const newProductData = {
      name,
      description,
      price,
      category,
      brand,
      stockQuantity,
      images,
      vendorId,
      vendorName,
      averageRating,
      totalReviews,
    };

    const newProd = new Product(newProductData);
    await newProd.save();

    return res.status(201).json({
      success: true,
      message: "Successfully added new product",
      data: newProd,
    });
  } catch (error) {
    console.log(`Error creating product: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

/* ------- Update Product -------- */
exports.updateSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const { name, description, price, category, brand, stockQuantity, images } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid product ID format" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price }),
        ...(category && { category }),
        ...(brand && { brand }),
        ...(stockQuantity && { stockQuantity }),
        ...(images && { images }),
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, error: "Product not found!" });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.log(`Error updating product: ${error}`);
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

/* -------- Delete Product ------- */
exports.deleteSingleProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!mongoose.isValidObjectId(productId)) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid product ID format" });
    }

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "No product found for deletion",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.log(`Error deleting product: ${error}`);
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};
