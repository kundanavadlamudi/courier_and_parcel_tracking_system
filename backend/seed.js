const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Parcel = require('./models/Parcel');

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/courierdb';

const seed = async () => {
  await mongoose.connect(MONGO_URI);
  console.log('Connected to MongoDB');

  // Clear existing
  await User.deleteMany({});
  await Parcel.deleteMany({});
  console.log('Cleared existing data');

  // Create users
  const adminUser = await User.create({
    name: 'Admin User',
    email: 'admin.parcelyt@gmail.com',
    password: 'admin123',
    role: 'admin',
    phone: '+91-9876543210',
    address: 'Parcelyt HQ, Hyderabad, Telangana'
  });

  const normalUser = await User.create({
    name: 'Ravi Kumar',
    email: 'ravi.parcelyt@gmail.com',
    password: 'demo123',
    role: 'user',
    phone: '+91-9123456789',
    address: '12-3-456, Banjara Hills, Hyderabad'
  });

  const user2 = await User.create({
    name: 'Priya Sharma',
    email: 'priya.parcelyt@gmail.com',
    password: 'demo123',
    role: 'user',
    phone: '+91-9988776655',
    address: 'Sector 21, Dwarka, New Delhi'
  });

  console.log('Users created');

  // Helper to generate tracking ID
  const genId = (n) => `TRK${String(n).padStart(10, '0')}`;

  // Create sample parcels
  const parcels = [
    {
      trackingId: genId(1001),
      senderName: 'Ravi Kumar', senderPhone: '+91-9123456789', senderAddress: 'Banjara Hills, Hyderabad',
      receiverName: 'Amit Singh', receiverPhone: '+91-9000011111', receiverAddress: 'Connaught Place, New Delhi',
      parcelType: 'Electronics', weight: 1.5, priority: 'Express', status: 'Delivered',
      userId: normalUser._id,
      trackingHistory: [
        { status: 'Booked', location: 'Hyderabad', description: 'Parcel booked', updatedAt: new Date(Date.now() - 5 * 86400000) },
        { status: 'Picked Up', location: 'Hyderabad Hub', description: 'Picked up by courier', updatedAt: new Date(Date.now() - 4 * 86400000) },
        { status: 'In Transit', location: 'Nagpur Sorting', description: 'In transit via road', updatedAt: new Date(Date.now() - 3 * 86400000) },
        { status: 'Out for Delivery', location: 'New Delhi Hub', description: 'Out for delivery', updatedAt: new Date(Date.now() - 86400000) },
        { status: 'Delivered', location: 'New Delhi', description: 'Delivered successfully', updatedAt: new Date() },
      ],
      estimatedDelivery: new Date(Date.now() - 86400000),
      actualDelivery: new Date(),
    },
    {
      trackingId: genId(1002),
      senderName: 'Ravi Kumar', senderPhone: '+91-9123456789', senderAddress: 'Banjara Hills, Hyderabad',
      receiverName: 'Suresh Babu', receiverPhone: '+91-9222233333', receiverAddress: 'T Nagar, Chennai',
      parcelType: 'Clothing', weight: 0.8, priority: 'Standard', status: 'In Transit',
      userId: normalUser._id,
      trackingHistory: [
        { status: 'Booked', location: 'Hyderabad', description: 'Parcel booked', updatedAt: new Date(Date.now() - 2 * 86400000) },
        { status: 'Picked Up', location: 'Hyderabad Hub', description: 'Picked up by courier', updatedAt: new Date(Date.now() - 86400000) },
        { status: 'In Transit', location: 'Bengaluru Sorting', description: 'In transit to Chennai', updatedAt: new Date() },
      ],
      estimatedDelivery: new Date(Date.now() + 3 * 86400000),
    },
    {
      trackingId: genId(1003),
      senderName: 'Ravi Kumar', senderPhone: '+91-9123456789', senderAddress: 'Banjara Hills, Hyderabad',
      receiverName: 'Meena Kapoor', receiverPhone: '+91-9444455555', receiverAddress: 'Andheri West, Mumbai',
      parcelType: 'Document', weight: 0.2, priority: 'Overnight', status: 'Out for Delivery',
      userId: normalUser._id,
      trackingHistory: [
        { status: 'Booked', location: 'Hyderabad', description: 'Parcel booked', updatedAt: new Date(Date.now() - 86400000) },
        { status: 'Picked Up', location: 'Hyderabad Airport', description: 'Picked up for air freight', updatedAt: new Date(Date.now() - 20 * 3600000) },
        { status: 'In Transit', location: 'Mumbai Airport', description: 'Arrived at Mumbai', updatedAt: new Date(Date.now() - 8 * 3600000) },
        { status: 'Out for Delivery', location: 'Andheri Hub', description: 'Out for final delivery', updatedAt: new Date(Date.now() - 2 * 3600000) },
      ],
      estimatedDelivery: new Date(Date.now() + 3600000),
    },
    {
      trackingId: genId(1004),
      senderName: 'Priya Sharma', senderPhone: '+91-9988776655', senderAddress: 'Dwarka, New Delhi',
      receiverName: 'Kiran Reddy', receiverPhone: '+91-9666677777', receiverAddress: 'Jubilee Hills, Hyderabad',
      parcelType: 'Medicine', weight: 0.5, priority: 'Express', status: 'Booked',
      userId: user2._id,
      trackingHistory: [
        { status: 'Booked', location: 'New Delhi', description: 'Parcel booked successfully', updatedAt: new Date() },
      ],
      estimatedDelivery: new Date(Date.now() + 3 * 86400000),
    },
    {
      trackingId: genId(1005),
      senderName: 'Priya Sharma', senderPhone: '+91-9988776655', senderAddress: 'Dwarka, New Delhi',
      receiverName: 'Vikram Joshi', receiverPhone: '+91-9555566666', receiverAddress: 'Koregaon Park, Pune',
      parcelType: 'Fragile', weight: 3.2, priority: 'Standard', status: 'Picked Up',
      userId: user2._id,
      trackingHistory: [
        { status: 'Booked', location: 'New Delhi', description: 'Parcel booked', updatedAt: new Date(Date.now() - 86400000) },
        { status: 'Picked Up', location: 'Delhi Sorting Center', description: 'Picked up carefully', updatedAt: new Date() },
      ],
      estimatedDelivery: new Date(Date.now() + 6 * 86400000),
    },
    {
      trackingId: genId(1006),
      senderName: 'Ravi Kumar', senderPhone: '+91-9123456789', senderAddress: 'Banjara Hills, Hyderabad',
      receiverName: 'Deepa Nair', receiverPhone: '+91-9777788888', receiverAddress: 'MG Road, Kochi',
      parcelType: 'Other', weight: 2.0, priority: 'Standard', status: 'Cancelled',
      userId: normalUser._id,
      trackingHistory: [
        { status: 'Booked', location: 'Hyderabad', description: 'Parcel booked', updatedAt: new Date(Date.now() - 3 * 86400000) },
        { status: 'Cancelled', location: 'Hyderabad', description: 'Cancelled by user request', updatedAt: new Date(Date.now() - 2 * 86400000) },
      ],
      estimatedDelivery: new Date(Date.now() + 5 * 86400000),
    },
  ];

  await Parcel.insertMany(parcels);
  console.log(`Created ${parcels.length} sample parcels`);

  // Add notifications
  await User.findByIdAndUpdate(normalUser._id, {
    $push: {
      notifications: {
        $each: [
          { message: `Parcel ${genId(1003)} is Out for Delivery in Mumbai!`, read: false },
          { message: `Parcel ${genId(1001)} has been Delivered successfully.`, read: true },
          { message: `Parcel ${genId(1002)} is In Transit via Bengaluru.`, read: false },
        ]
      }
    }
  });

  console.log('\n✅ Seed complete!\n');
  console.log('Demo Accounts:');
  console.log('  Admin:  admin.parcelyt@gmail.com / admin123');
  console.log('  User 1: ravi.parcelyt@gmail.com  / demo123');
  console.log('  User 2: priya.parcelyt@gmail.com / demo123\n');

  await mongoose.disconnect();
  process.exit(0);
};

seed().catch(err => { console.error(err); process.exit(1); });
