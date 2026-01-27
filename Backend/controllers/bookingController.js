import { Booking } from "../models/bookingModel.js";
import { User } from "../models/userModel.js";
import Course from "../models/courseModel.js";
import { Op } from "sequelize";

// Helper function to generate booking ID
const genBookingId = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 7);
  return `BK-${timestamp}-${random}`.toUpperCase();
};

// Get all bookings (Admin only)
export const getBookings = async (req, res) => {
  try {
    const { search = "", status, limit = 50, page = 1 } = req.query;
    
    const limitNum = Math.min(200, Math.max(1, parseInt(limit, 10)));
    const pageNum = Math.max(1, parseInt(page, 10));
    const offset = (pageNum - 1) * limitNum;

    const where = {};

    // Filter by status
    if (status) {
      where.orderStatus = status;
    }

    // Search filter
    if (search) {
      where[Op.or] = [
        { bookingId: { [Op.iLike]: `%${search}%` } },
        { courseName: { [Op.iLike]: `%${search}%` } },
        { studentName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const bookings = await Booking.findAll({
      where,
      limit: limitNum,
      offset,
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email']
        }
      ]
    });

    const total = await Booking.count({ where });

    return res.json({
      success: true,
      bookings,
      meta: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('getBookings error:', error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    });
  }
};

// Check if user is enrolled in a course
export const checkBooking = async (req, res) => {
  try {
    const userId = req.user?.id; // From JWT middleware
    
    if (!userId) {
      return res.status(200).json({
        success: true,
        enrolled: false,
        booking: null
      });
    }

    const { courseId } = req.query;
    
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required"
      });
    }

    const booking = await Booking.findOne({
      where: {
        userId,
        courseId
      },
      order: [['createdAt', 'DESC']]
    });

    if (!booking) {
      return res.status(200).json({
        success: true,
        enrolled: false,
        booking: null
      });
    }

    // Check if booking is paid/confirmed
    const enrolled = 
      booking.paymentStatus === 'Paid' || 
      booking.orderStatus === 'Confirmed' ||
      booking.paidAt !== null;

    return res.status(200).json({
      success: true,
      enrolled,
      booking
    });
  } catch (error) {
    console.error("checkBooking error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Create a booking (enrollment)
export const createBooking = async (req, res) => {
  try {
    const userId = req.user?.id; // From JWT middleware
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const {
      courseId,
      courseName,
      teacherName = "",
      price,
      notes = ""
    } = req.body;

    // Validation
    if (!courseId || !courseName) {
      return res.status(400).json({ 
        success: false, 
        message: "courseId and courseName are required" 
      });
    }

    const numericPrice = parseFloat(price) || 0;
    
    if (numericPrice < 0) {
      return res.status(400).json({ 
        success: false, 
        message: "Price must be a positive number" 
      });
    }

    // Check if user already enrolled
    const existingBooking = await Booking.findOne({
      where: {
        userId,
        courseId,
        paymentStatus: 'Paid'
      }
    });

    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: "You are already enrolled in this course"
      });
    }

    // Get user info
    const user = await User.findByPk(userId);
    const studentName = user.username;

    // Generate booking ID
    const bookingId = genBookingId();

    // Create booking
    const booking = await Booking.create({
      bookingId,
      userId,
      studentName,
      courseId,
      courseName,
      teacherName,
      price: numericPrice,
      paymentMethod: "Online",
      paymentStatus: numericPrice === 0 ? "Paid" : "Unpaid",
      notes,
      orderStatus: numericPrice === 0 ? "Confirmed" : "Pending",
      paidAt: numericPrice === 0 ? new Date() : null
    });

    // For free courses, mark as paid immediately
    if (numericPrice === 0) {
      return res.status(201).json({ 
        success: true, 
        booking,
        message: "Successfully enrolled in free course!",
        checkoutUrl: null
      });
    }

    // For paid courses, return fake payment URL
    const fakeCheckoutUrl = `http://localhost:5173/payment/${booking.id}`;

    return res.status(201).json({ 
      success: true, 
      booking,
      checkoutUrl: fakeCheckoutUrl,
      message: "Booking created. Proceed to payment."
    });

  } catch (error) {
    console.error("createBooking error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error: " + error.message 
    });
  }
};

// Confirm payment (fake payment simulation)
export const confirmPayment = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Authentication required" 
      });
    }

    const { bookingId } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({ 
        success: false, 
        message: "bookingId is required" 
      });
    }

    // Find booking
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        userId
      }
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    if (booking.paymentStatus === 'Paid') {
      return res.status(400).json({
        success: false,
        message: "Payment already confirmed"
      });
    }

    // Update booking to paid
    await booking.update({
      paymentStatus: "Paid",
      orderStatus: "Confirmed",
      paidAt: new Date(),
      paymentIntentId: `fake_payment_${Date.now()}`
    });

    return res.json({ 
      success: true, 
      booking,
      message: "Payment confirmed successfully!"
    });

  } catch (error) {
    console.error("confirmPayment error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required'
      });
    }

    const bookings = await Booking.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name', 'teacher', 'image']
        }
      ]
    });

    return res.json({
      success: true,
      bookings
    });

  } catch (error) {
    console.error("getUserBookings error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};

// Get booking statistics (Admin only)
export const getStats = async (req, res) => {
  try {
    // Total bookings
    const totalBookings = await Booking.count();

    // Total revenue (only paid bookings)
    const revenueResult = await Booking.sum('price', {
      where: {
        paymentStatus: 'Paid'
      }
    });
    const totalRevenue = revenueResult || 0;

    // Bookings in last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const bookingsLast7Days = await Booking.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    // Top courses by bookings
    const topCourses = await Booking.findAll({
      attributes: [
        'courseName',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('price')), 'revenue']
      ],
      group: ['courseName'],
      order: [[sequelize.fn('COUNT', sequelize.col('id')), 'DESC']],
      limit: 6,
      raw: true
    });

    return res.json({
      success: true,
      stats: {
        totalBookings,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        bookingsLast7Days,
        topCourses
      }
    });

  } catch (error) {
    console.error("getStats error:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Server error" 
    });
  }
};