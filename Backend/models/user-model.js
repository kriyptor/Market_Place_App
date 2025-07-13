const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, 'Please add a username'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    /* match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please add a valid email'
    ] */
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    select: false // Do not return password in queries by default
  },
  role: {
    type: String,
    enum: ['buyer', 'vendor'],
    default: 'buyer'
  },
  wallet: {
    type: Number,
    default: 100,
    required: function() { return this.role === 'buyer'; },
    // Only present if role is 'buyer'
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    zipCode: { type: String },
    country: { type: String }
  },
  phone: {
    type: String,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please add a valid phone number'] // Basic international phone format
  },
  // Vendor-specific fields (optional, only present if role is 'vendor')
  vendorInfo: {
    storeName: {
      type: String,
      trim: true
    },
    description: {
      type: String,
      maxlength: [500, 'Description can not be more than 500 characters']
    },
  }
}, { timestamps: true });

// Remove vendorInfo if role is buyer, and wallet if role is vendor before saving
UserSchema.pre('save', function(next) {
  if (this.role === 'buyer') {
    this.vendorInfo = undefined;
  } else if (this.role === 'vendor') {
    this.wallet = undefined;
  }
  next();
});

const User = mongoose.model('User', UserSchema);

module.exports = { User };