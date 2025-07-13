const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: true
  },
  buyerId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  buyerName: { // Denormalized for display
    type: String,
    required: true
  },
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating can not be more than 5'],
    required: [true, 'Please add a rating between 1 and 5']
  },
  comment: {
    type: String,
    maxlength: [500, 'Comment can not be more than 500 characters']
  },
  status: { // For moderation
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
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

// IMPORTANT: Ensure a buyer can only submit one review per product
ReviewSchema.index({ productId: 1, buyerId: 1 }, { unique: true });
ReviewSchema.index({ productId: 1 }); // For fetching all reviews for a product
ReviewSchema.index({ buyerId: 1 });   // For fetching all reviews by a user

module.exports = mongoose.model('Review', ReviewSchema);