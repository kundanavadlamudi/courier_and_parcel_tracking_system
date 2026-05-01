const mongoose = require('mongoose');

const trackingUpdateSchema = new mongoose.Schema({
  status: { type: String, required: true },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  updatedAt: { type: Date, default: Date.now }
});

const parcelSchema = new mongoose.Schema({
  trackingId: { type: String, required: true, unique: true },
  senderName: { type: String, required: true },
  senderPhone: { type: String, default: '' },
  senderAddress: { type: String, required: true },
  receiverName: { type: String, required: true },
  receiverPhone: { type: String, default: '' },
  receiverAddress: { type: String, required: true },
  parcelType: {
    type: String,
    enum: ['Document', 'Electronics', 'Clothing', 'Food', 'Fragile', 'Medicine', 'Other'],
    default: 'Other'
  },
  weight: { type: Number, default: 1 },
  dimensions: { type: String, default: '' },
  description: { type: String, default: '' },
  status: {
    type: String,
    enum: ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Cancelled', 'Returned'],
    default: 'Booked'
  },
  priority: { type: String, enum: ['Standard', 'Express', 'Overnight'], default: 'Standard' },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trackingHistory: [trackingUpdateSchema],
  estimatedDelivery: { type: Date },
  actualDelivery: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Parcel', parcelSchema);
