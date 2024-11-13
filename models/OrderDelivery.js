// models/OrderDelivery.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const OrderDeliverySchema = new Schema({
  requestID: {
    type: String,
    required: true,
    unique: true,
  },
  contactName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  country: String,
  addressLine: String,
  postalCode: String,
  city: String,
  packageDimensions: {
    width: Number,
    length: Number,
    height: Number,
    weight: Number,
  },
  pickupLocation: {
    country: String,
    address: String,
    zipcode: String,
    city: String,
  },
  dropoffLocation: {
    country: String,
    address: String,
    zipcode: String,
    city: String,
  },
  shippingMethod: {
    type: String,
    required: true,
    enum: ['express', 'standard'],
  },
  paymentStatus: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed'],
  },
  deliveryStatus: {
    type: String,
    default: 'pending',
    enum: ['pending', 'in transit', 'delivered', 'canceled'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model is already compiled to prevent OverwriteModelError
module.exports = mongoose.models.OrderDelivery || mongoose.model('OrderDelivery', OrderDeliverySchema);