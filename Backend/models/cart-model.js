const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1'],
    default: 1
  },
  image: {
    type: String
  },
  vendorId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  vendorName: {
    type: String,
    required: true
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
}, { timestamps: true });

const Cart = mongoose.model('Cart', CartSchema)

module.exports = { Cart };