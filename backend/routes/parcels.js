const express = require('express');
const router = express.Router();
const { createParcel, trackParcel, getUserParcels, getDashboardStats } = require('../controllers/parcelController');
const { protect } = require('../middleware/auth');

router.post('/', protect, createParcel);
router.get('/my', protect, getUserParcels);
router.get('/dashboard', protect, getDashboardStats);
router.get('/:trackingId', trackParcel);

module.exports = router;
