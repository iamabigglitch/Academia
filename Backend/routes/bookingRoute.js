import express from 'express';
import { checkBooking, confirmPayment, createBooking, getBookings, getStats, getUserBookings } from '../controllers/bookingController';

const bookingRoute = express.Router();

bookingRoute.get('/', getBookings);
bookingRoute.get('/stats', getStats);

bookingRoute.post('/create', createBooking);
bookingRoute.get('/check', checkBooking );
bookingRoute.get('/confirm', confirmPayment)

bookingRoute.get('/my', getUserBookings);

export default bookingRoute;