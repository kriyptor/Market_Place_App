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
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    country: { type: String, required: true }
  },
  paymentStatus: {
    type: String,
    enum: ['Pending', 'Paid', 'Failed', 'Refunded'],
    default: 'Pending'
  },
  orderStatus: {
    type: String,
    enum: ['Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Processing'
  },
  items: [OrderItemSchema] // Array of embedded order items
});

// Indexing for efficient queries
OrderSchema.index({ buyerId: 1 });
OrderSchema.index({ orderDate: -1 });
OrderSchema.index({ "items.vendorId": 1 }); // Multi-key index for vendor sales dashboard

module.exports = mongoose.model('Order', OrderSchema);