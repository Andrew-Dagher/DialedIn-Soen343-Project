import mongoose from 'mongoose';
const { Schema } = mongoose;

const TrackingSchema = new Schema({
  packageId: { type: String, required: true, unique: true },
  clientContact: { type: String, required: true },
  clientName: { type: String, required: true },
  clientPhone: { type: String },
  locationDetails: {
    location: { type: String },
    description: { type: String },
    progress: { type: Number, default: 0 }
  },
  deliveryProgress: { type: Number, default: 0 },
  userId: { type: String, default: null }
});

module.exports = mongoose.models.Tracking || mongoose.model('Tracking', TrackingSchema);
