// models/OrderDelivery.js
const mongoose = require('mongoose');
const { number } = require('zod');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
  
  orderID: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
  rating: {
    type: Number,
    required:true,
  },
  userId:{
    type: String,
    required: true,
    default: '0',
  }
});

// Check if the model is already compiled to prevent OverwriteModelError
module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);