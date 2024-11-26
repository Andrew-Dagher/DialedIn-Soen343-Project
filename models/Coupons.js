// models/Coupon.js

const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid');

const CouponSchema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  couponID: {
    type: String,
    unique: true,
  },
  discountPercentage: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isUsed: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
