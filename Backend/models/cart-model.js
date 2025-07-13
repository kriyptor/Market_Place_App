const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: { // Denormalized
    type: String,
    required: true
  },
  price: { // Denormalized (price at time of adding to cart)
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  image: { // Denormalized
    type: String
  }
}, { _id: false }); // Do not create _id for subdocuments unless explicitly needed

const CartSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Ensure only one cart per buyer
  },
  items: [CartItemSchema], // Array of embedded cart items
  totalItems: { // Calculated count of all items (sum of quantities)
    type: Number,
    default: 0
  },
  totalAmount: { // Calculated total cost of all items
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Cart', CartSchema);