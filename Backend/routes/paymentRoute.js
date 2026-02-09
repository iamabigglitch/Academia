import express from 'express';
import {
  processPayment,
  getPaymentHistory,
  verifyPayment,
  refundPayment
} from '../controllers/paymentController.js';
import { protect } from '../Middleware/authmiddleware.js';

const router = express.Router();

// Process payment
router.post('/process', protect, processPayment);

// Get payment history
router.get('/history', protect, getPaymentHistory);

// Verify payment status
router.get('/verify/:transactionId', protect, verifyPayment);

// Refund payment
router.post('/refund/:transactionId', protect, refundPayment);

export default router;
