const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  productName: {
    type: String,
    required: true
  },
  price: { // Price at the time of purchase
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  vendorId: { // Denormalized reference to the vendor who sold this specific item
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  vendorName: { // Denormalized
    type: String,
    required: true
  }
}, { _id: false }); // Do not create _id for subdocuments

const OrderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  buyerEmail: { // Denormalized
    type: String,
    required: true
  },
  orderDate: {
    type: Date,
    default: Date.now
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  shippingAddress: {
    type: String,
    required: true
  },
  paymentStatus: {
    type: String,
    default: 'Paid'
  },
  items: [OrderItemSchema] // Array of embedded order items
}, { timestamps: true });

// Indexing for efficient queries
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ orderDate: -1 });
OrderSchema.index({ "items.vendorId": 1 }); // Multi-key index for vendor sales dashboard

const Order = mongoose.model('Order', OrderSchema);

module.exports = { Order }