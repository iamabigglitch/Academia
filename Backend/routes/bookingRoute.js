import express from 'express';
import { getBookings, checkBooking, createBooking, confirmPayment, getUserBookings, getStats } from '../controllers/bookingController.js';
import { protect } from '../Middleware/authmiddleware.js';

const router = express.Router();

router.get('/check', checkBooking);

router.post('/create', protect, createBooking);
router.post('/confirm-payment', protect, confirmPayment);
router.get('/my-bookings', protect, getUserBookings);

router.get('/', protect, getBookings);
router.get('/stats', protect, getStats);

export default router;