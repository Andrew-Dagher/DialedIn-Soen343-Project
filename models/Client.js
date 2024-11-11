// models/Client.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ClientSchema = new Schema({
  requestID: { type: String, unique: true },
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  address: { type: String, required: true },
  paymentInfo: {
    card_number: { type: String, default: null },
    expiry_date: { type: String, default: null },
    cvv: { type: String, default: null }
  },
  paid: { type: Boolean, default: false },
  paid_deposit: { type: Boolean, default: false }
}, { timestamps: true });

// Check if the model is already compiled to prevent OverwriteModelError
module.exports = mongoose.models.Client || mongoose.model('Client', ClientSchema);
