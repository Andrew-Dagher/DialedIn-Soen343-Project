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
  billingLocation: {
    address: { type: String },
    city: { type: String },
    zipcode: { type: String },
    country: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    formattedAddress: { type: String },
  },
  pickupLocation: {
    address: { type: String },
    city: { type: String },
    zipcode: { type: String },
    country: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    formattedAddress: { type: String },
  },
  dropoffLocation: {
    address: { type: String },
    city: { type: String },
    zipcode: { type: String },
    country: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    formattedAddress: { type: String },
  },
  packageDimensions: {
    weight: { type: String },
    length: { type: String },
    width: { type: String },
    height: { type: String },
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
  userId: {
    type: String,
    default: '0',
  },
});

module.exports = mongoose.models.OrderDelivery || mongoose.model('OrderDelivery', OrderDeliverySchema);
