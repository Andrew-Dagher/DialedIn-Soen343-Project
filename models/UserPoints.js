// models/UserPoints.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserPointsSchema = new Schema({
  userId: {
    type: String,
    required: true,
    unique: true,
  },
  pointsBalance: {
    type: Number,
    default: 0,
  },
});

module.exports = mongoose.models.UserPoints || mongoose.model('UserPoints', UserPointsSchema);
