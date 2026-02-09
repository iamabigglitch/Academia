import { Booking } from "../models/bookingModel.js";
import { User } from "../models/userModel.js";
import Course from "../models/courseModel.js";
import { v4 as uuidv4 } from 'uuid';

// Process payment
export const processPayment = async (req, res) => {
  try {
    const { paymentMethod, amount, courseId, cardDetails, upiId, bank, courseName, teacherName } = req.body;
    const userId = req.user?.id;

    if (!paymentMethod || !amount || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing required payment information"
      });
    }

    // Validate payment method
    if (!['card', 'upi', 'netbanking'].includes(paymentMethod)) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method"
      });
    }

    // Get user info
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Check if user already has a paid booking for this course
    const existingBooking = await Booking.findOne({
      where: {
        userId,
        courseId,
        paymentStatus: "Paid"
      }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course"
      });
    }

    // Validate payment method details
    if (paymentMethod === 'card' && !cardDetails) {
      return res.status(400).json({
        success: false,
        message: "Card details are required"
      });
    }

    if (paymentMethod === 'upi' && !upiId) {
      return res.status(400).json({
        success: false,
        message: "UPI ID is required"
      });
    }

    if (paymentMethod === 'netbanking' && !bank) {
      return res.status(400).json({
        success: false,
        message: "Bank selection is required"
      });
    }

    // Generate transaction ID and booking ID
    const transactionId = `TXN-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;
    const bookingId = `BK-${Date.now()}-${uuidv4().split('-')[0].toUpperCase()}`;

    const booking = await Booking.create({
      bookingId,
      userId,
      studentName: user.username || "Unknown",
      courseId,
      courseName: courseName || "Unknown Course",
      teacherName: teacherName || "",
      price: amount,
      paymentMethod: "Online",
      paymentStatus: "Paid",
      orderStatus: "Pending",
      paymentIntentId: transactionId,
      paidAt: new Date(),
      notes: JSON.stringify({
        paymentMethod,
        transactionId,
        cardLast4: cardDetails ? cardDetails.cardNumber.slice(-4) : null,
        upiId: upiId || null,
        bank: bank || null,
        paymentTime: new Date().toISOString()
      })
    });

    res.status(200).json({
      success: true,
      message: "Payment processed successfully. Your booking is pending admin approval.",
      transactionId,
      booking: {
        bookingId: booking.bookingId,
        id: booking.id,
        orderStatus: booking.orderStatus,
        paymentStatus: booking.paymentStatus,
        courseId: booking.courseId
      }
    });

  } catch (err) {
    console.error("processPayment error:", err);
    res.status(500).json({
      success: false,
      message: "Payment processing failed"
    });
  }
};

// Get payment history for a user
export const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user?.id;

    const payments = await Booking.findAll({
      where: {
        userId,
        paymentStatus: 'Paid'
      },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name', 'image']
        }
      ],
      order: [['paidAt', 'DESC']]
    });

    res.json({
      success: true,
      payments
    });
  } catch (err) {
    console.error("getPaymentHistory error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch payment history"
    });
  }
};

// Verify payment status
export const verifyPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user?.id;

    const booking = await Booking.findOne({
      where: {
        paymentIntentId: transactionId,
        userId
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    res.json({
      success: true,
      paymentStatus: booking.paymentStatus,
      orderStatus: booking.orderStatus,
      booking
    });
  } catch (err) {
    console.error("verifyPayment error:", err);
    res.status(500).json({
      success: false,
      message: "Verification failed"
    });
  }
};

// Refund payment
export const refundPayment = async (req, res) => {
  try {
    const { transactionId } = req.params;
    const userId = req.user?.id;

    const booking = await Booking.findOne({
      where: {
        paymentIntentId: transactionId,
        userId
      }
    });

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    if (booking.paymentStatus !== 'Paid') {
      return res.status(400).json({
        success: false,
        message: "Payment is not in paid status"
      });
    }

    const daysSincePaid = Math.floor((new Date() - new Date(booking.paidAt)) / (1000 * 60 * 60 * 24));
    
    if (daysSincePaid > 30) {
      return res.status(400).json({
        success: false,
        message: "Refund can only be processed within 30 days"
      });
    }

    // Update booking status
    await booking.update({
      paymentStatus: 'Paid',
      orderStatus: 'Cancelled'
    });

    res.json({
      success: true,
      message: "Refund initiated successfully",
      booking
    });
  } catch (err) {
    console.error("refundPayment error:", err);
    res.status(500).json({
      success: false,
      message: "Refund processing failed"
    });
  }
};
