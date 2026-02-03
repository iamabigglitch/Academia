import express from 'express';
import {  createBooking,  getStats, getAllBookings, getMyBookings, checkEnrollment, approveBooking, rejectBooking } from '../controllers/bookingController.js';
import { protect } from '../Middleware/authmiddleware.js';

const router = express.Router();

router.get('/check/:id',protect, checkEnrollment);

router.post('/create', protect, createBooking);
router.get('/my-bookings', protect, getMyBookings);

router.get('/', protect, getAllBookings);
router.get('/stats', protect, getStats);

router.put('/:bookingId/approve', approveBooking);
router.put('/:bookingId/reject',  rejectBooking);

export default router;