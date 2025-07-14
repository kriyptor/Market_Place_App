const mongoose = require("mongoose");
const { Cart } = require(`../models/cart-model`);
const { User } = require(`../models/user-model`);


/* -------- Get Cart  --------- */

exports.getTheCart = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!mongoose.isValidObjectId(userId)) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid user & product ID format" });
    }

    const cart = await Cart.findOne({ buyerId: userId });

    return res.status(200).json({
      success: true,
      message: "Success",
      data: cart,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
        return res.status(400).json({ success: false, message: "Validation failed", error: error.message });
    }
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};



/* -------- Create Product --------- */
exports.addProductToCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const { productId, productName, price, image } = req.body;

    if (!mongoose.isValidObjectId(productId)) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid product ID format" });
    }

    // Validate required fields
    if (!productName || !price || !image || !userId ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing!",
      });
    }

    const cart = await Cart.findOne({ buyerId: userId });

/*     const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));
    
    if (itemIndex === -1) {
      const newCartItem = { productId, productName, price, image, quantity: 1 };
      cart.items.push(newCartItem);
    } else {
      cart.items[itemIndex].quantity += 1;
    }

    cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    cart.totalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    await cart.save();
 */
    /* let updatedCart;
    if (itemIndex) {
      updatedCart = await Cart.findOneAndUpdate(
        { buyerId: userId },
        {
          $push: {
            items: { productId, productName, price, image, quantity: 1 },
          },
          $set: {
            totalItems: cart.totalItems + 1,
            totalAmount: cart.totalAmount + price,
          },
        },
        { new: true }
      );
    } else {
      updatedCart = await Cart.findOneAndUpdate(
        { buyerId: userId, "items.productId": productId },
        {
          $inc: {
            items: { "items.$.quantity": 1, totalItems: 1, totalAmount: 1 },
          },
        },
        { new: true }
      );
    } */

    // Check if product exists in cart
    const itemIndex = cart.items.findIndex(item => item.productId.equals(productId));

    let updatedCart;
    if (itemIndex === -1) {
      // New product: Add to items array
      updatedCart = await Cart.findOneAndUpdate(
        { buyerId: userId },
        {
          $push: {
            items: { productId, productName, price, image, quantity: 1 },
          },
          $inc: {
            totalItems: 1, // Increment by 1 for new item
            totalAmount: price, // Add product's price
          },
        },
        { new: true, runValidators: true }
      );
    } else {
      // Existing product: Increment quantity
      updatedCart = await Cart.findOneAndUpdate(
        { buyerId: userId, "items.productId": productId },
        {
          $inc: {
            "items.$.quantity": 1, // Increment quantity of matched item
            totalItems: 1, // Increment total items
            totalAmount: price, // Add price for one more unit
          },
        },
        { new: true, runValidators: true }
      );
    }

    return res.status(201).json({
      success: true,
      message: "Successfully added new product",
      data: updatedCart,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
        return res.status(400).json({ success: false, message: "Validation failed", error: error.message });
    }
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};


/* --------------- Checkout & Buy Product --------------- */

exports.checkoutFromCart = async (req, res) => {
  try {
        const userId = req.user._id;

    if (!mongoose.isValidObjectId(userId)) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid user & user & product ID format" });
    }

    const cart = await Cart.findOne({ buyerId: userId });
    
    if(!cart){
         return res
            .status(400)
            .json({ success: false, error: "Cart Not found" });
    }

    const updatedCart = await Cart.findOneAndUpdate(
        { buyerId: userId },
        {
          $set: {
            items : [],
            totalItems: 0, // Dec total items
            totalAmount: 0, // Dec price for one more unit
          },
        },
        { new: true, runValidators: true }
    );

     if (!updatedCart) {
      return res.status(404).json({
        success: false,
        error: "Failed to update cart",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Success",
      data: updatedCart,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
        return res.status(400).json({ success: false, message: "Validation failed", error: error.message });
    }
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};



/* --------------- Update Quantity --------------- */

exports.updateProductQtyInCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const productId = req.params.id;
    const { quantity } = req.body;

    if (!quantity || typeof quantity !== 'number') {
      return res.status(400).json({ success: false, error: "Quantity data is missing or invalid" });
    }

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
      return res.status(400).json({ success: false, error: "Invalid user or product ID format" });
    }

    const cart = await Cart.findOne({ buyerId: userId, "items.productId": productId });
    if (!cart) {
      return res.status(404).json({ success: false, error: "Cart not found" });
    }

    const product = cart.items.find((entry) => entry.productId.equals(productId));
    if (!product) {
      return res.status(404).json({ success: false, error: "Product not found in cart" });
    }

    const newQty = product.quantity + quantity;
    if (newQty < 1) {
      // Remove item if quantity drops below 1
      await Cart.findOneAndUpdate(
        { buyerId: userId },
        {
          $pull: { items: { productId } },
          $inc: {
            totalItems: -product.quantity,
            totalAmount: -(product.price * product.quantity),
          },
        },
        { new: true, runValidators: true }
      );
      return res.status(200).json({ success: true, message: "Product removed from cart", data: cart });
    }

    const netPrice = product.price * quantity;

    const updatedCart = await Cart.findOneAndUpdate(
      { buyerId: userId, "items.productId": productId },
      {
        $inc: {
          "items.$.quantity": quantity,
          totalItems: quantity,
          totalAmount: netPrice,
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedCart) {
      return res.status(404).json({ success: false, error: "Failed to update cart" });
    }

    return res.status(200).json({
      success: true,
      message: "Product quantity updated",
      data: updatedCart,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({ success: false, message: "Validation failed", error: error.message });
    }
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
  }
};


/* --------------- Remove Product --------------- */
exports.removeProductFromCart = async (req, res) => {
  try {
        const userId = req.user._id;

        const productId = req.params.id;

    if (!mongoose.isValidObjectId(userId) || !mongoose.isValidObjectId(productId)) {
          return res
            .status(400)
            .json({ success: false, error: "Invalid user & user & product ID format" });
    }

    const cart = await Cart.findOne({ buyerId: userId, "items.productId": productId });
    
    const product = cart.items.find((entry) => entry.productId.equals(productId));
    
    if(!product){
         return res
            .status(400)
            .json({ success: false, error: "Product not found in cart" });
    }

    const netQty = product.quantity;
    const netPrice = product.price*netQty;

    const updatedCart = await Cart.findOneAndUpdate(
        { buyerId: userId, "items.productId": productId },
        {
          $pull : { items : { productId }},  
          $inc: {
            totalItems: -netQty, // Dec total items
            totalAmount: -netPrice, // Dec price for one more unit
          },
        },
        { new: true, runValidators: true }
    );

     if (!updatedCart) {
      return res.status(404).json({
        success: false,
        error: "Failed to update cart",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Success",
      data: updatedCart,
    });

  } catch (error) {
    if (error.name === "ValidationError") {
        return res.status(400).json({ success: false, message: "Validation failed", error: error.message });
    }
    console.log(`Error: ${error}`);
    return res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};