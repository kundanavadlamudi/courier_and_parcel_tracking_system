const Parcel = require('../models/Parcel');
const User = require('../models/User');
const { customAlphabet } = require('nanoid');

const nanoid = customAlphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789', 10);

exports.createParcel = async (req, res) => {
  try {
    const trackingId = 'TRK' + nanoid();
    const eta = new Date();
    eta.setDate(eta.getDate() + (req.body.priority === 'Overnight' ? 1 : req.body.priority === 'Express' ? 3 : 7));

    const parcel = await Parcel.create({
      ...req.body,
      trackingId,
      userId: req.user._id,
      estimatedDelivery: eta,
      trackingHistory: [{ status: 'Booked', location: req.body.senderAddress, description: 'Parcel booked successfully' }]
    });

    // Add notification to user
    await User.findByIdAndUpdate(req.user._id, {
      $push: { notifications: { message: `Parcel ${trackingId} booked successfully!` } }
    });

    res.status(201).json(parcel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.trackParcel = async (req, res) => {
  try {
    const parcel = await Parcel.findOne({ trackingId: req.params.trackingId }).populate('userId', 'name email');
    if (!parcel) return res.status(404).json({ message: 'Parcel not found' });
    res.json(parcel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getUserParcels = async (req, res) => {
  try {
    const parcels = await Parcel.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(parcels);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const total = await Parcel.countDocuments({ userId });
    const delivered = await Parcel.countDocuments({ userId, status: 'Delivered' });
    const pending = await Parcel.countDocuments({ userId, status: { $in: ['Booked', 'Picked Up', 'In Transit', 'Out for Delivery'] } });
    const cancelled = await Parcel.countDocuments({ userId, status: 'Cancelled' });
    const recent = await Parcel.find({ userId }).sort({ createdAt: -1 }).limit(5);
    res.json({ total, delivered, pending, cancelled, recent });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
