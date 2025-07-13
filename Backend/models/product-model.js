const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a product name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [1000, 'Description can not be more than 1000 characters'],
    default : 'This is default text for the product description'
  },
  price: {
    type: Number,
    required: [true, 'Please add a price'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Electronics', 'Clothing', 'Home Goods', 'Books', 'Sports', 'Other'] // Example categories
  },
  brand: {
    type: String,
    trim: true,
    maxlength: [50, 'Brand name can not be more than 50 characters']
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Please add stock quantity'],
    min: [0, 'Stock quantity cannot be negative'],
    default: 10
  },
  images: {
    type: String, // Array of image URLs
    default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKnKnw0MtmVH5_-A-wrEh5OiTSL3lu_5MZZA&s'
  },
  vendorId: {
    type: mongoose.Schema.ObjectId, // Reference to the User model
    ref: 'User',
    required: true
  },
  vendorName: { // Denormalized for easier display
    type: String,
    required: true
  },
  averageRating: { // Denormalized average rating
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  totalReviews: { // Denormalized total number of reviews
    type: Number,
    min: 0,
    default: 0
  }
}, { timestamps: true });

// Indexing for efficient queries (as discussed)
ProductSchema.index({ vendorId: 1 });
ProductSchema.index({ category: 1 });
ProductSchema.index({ price: 1 });
ProductSchema.index({ name: 'text'}); // For text search

const Product = mongoose.model('Product', ProductSchema);

module.exports = { Product };