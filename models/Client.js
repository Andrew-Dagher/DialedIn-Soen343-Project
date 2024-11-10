const mongoose = require('mongoose')
const { Schema } = mongoose

const paymentInfo = {
  card_number: { type: String, default: null },
  expiry_date: { type: String, default: null },
  cvv: { type: String, default: null }
}

const Client = new Schema({
  email: { type: String, required: true },
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  phone_number: { type: String, required: true },
  address: { type: String, required: true },
  paymentInfo,
  paid: { type: Boolean, default: false },
  paid_deposit: { type: Boolean, default: false }
}, { timestamps: true })

module.exports = mongoose.model('Client', Client, 'clients')
