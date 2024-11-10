// models/Payment.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const PaymentSchema = new Schema({
  paymentID: {
    type: String,
    required: true,
    unique: true
  },
  requestID: { type: String, unique: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'completed', 'failed', 'refunded']
  },
  transactionDate: {
    type: Date,
    default: Date.now
  }
});

// Check if the model is already compiled to prevent OverwriteModelError
module.exports = mongoose.models.Payment || mongoose.model('Payment', PaymentSchema);
