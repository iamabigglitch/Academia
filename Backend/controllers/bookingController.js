import { Booking } from "../models/bookingModel.js";
import { User } from "../models/userModel.js";
import Course from "../models/courseModel.js";
import { Op } from "sequelize";
import { sequelize } from "../database/db.js";
// GET /api/booking - Get all bookings (for admin)
export const getAllBookings = async (req, res) => {
  try {
    const { search, limit = 200, page = 1 } = req.query;
    
    const where = {};
    
    // Search functionality
    if (search) {
      where[Op.or] = [
        { studentName: { [Op.iLike]: `%${search}%` } },
        { courseName: { [Op.iLike]: `%${search}%` } },
        { teacherName: { [Op.iLike]: `%${search}%` } },
        { bookingId: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const offset = (Number(page) - 1) * Number(limit);

    const bookings = await Booking.findAll({
      where,
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'username', 'email'],
          required: false
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name', 'teacher', 'image'],
          required: false
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: Number(limit),
      offset
    });

    res.json({ 
      success: true, 
      bookings,
      page: Number(page),
      limit: Number(limit)
    });
  } catch (err) {
    console.error("getAllBookings error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


export const checkEnrollment = async (req, res) => {
  console.log("api hit for checking enrollment")
  try {
    const userId = req.user?.id;
    console.log(userId)
    // if (!userId) {
    //   return res.status(401).json({ success: false, message: "Unauthorized" });
    // }

    const { id:courseId} = req.params;
console.log(courseId)
    if (!courseId) {
      return res.status(400).json({ 
        success: false, 
        message: "courseId is required" 
      });
    }

    const booking = await Booking.findOne({
      where: { 
        userId, 
        courseId,
        orderStatus: "Completed",
        paymentStatus: "Paid"
      }
    });

    const enrolled = !!booking;

    res.json({ 
      success: true, 
      enrolled,
      booking: booking || null
    });
  } catch (err) {
    console.error("checkEnrollment error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const createBooking = async (req, res) => {
  console.log("creta booking api hit")
  try {
    const userId = req.user?.id;
    console.log(userId)
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { courseId, courseName, teacherName, price } = req.body;

    if (!courseId || !courseName) {
      return res.status(400).json({ 
        success: false, 
        message: "courseId and courseName are required" 
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

    // Check if user already has a booking for this course
    const existingBooking = await Booking.findOne({
      where: { userId, courseId }
    });

    if (existingBooking) {
      // If booking exists and is completed, user is already enrolled
      if (existingBooking.orderStatus === "Completed" && existingBooking.paymentStatus === "Paid") {
        return res.status(400).json({ 
          success: false, 
          message: "You are already enrolled in this course" 
        });
      }
      
      // If booking exists but is pending, return the existing booking
      if (existingBooking.orderStatus === "Pending") {
        return res.json({ 
          success: true, 
          message: "You already have a pending booking for this course",
          booking: existingBooking
        });
      }
    }

    // Generate unique booking ID
    const bookingId = `BK-${Date.now()}-${userId}`;

    // Determine payment method and status based on price
    const numericPrice = Number(price) || 0;
    const isFree = numericPrice === 0;

    // Create booking
    const booking = await Booking.create({
      bookingId,
      userId,
      studentName: user.name || "Unknown",
      courseId,
      courseName,
      teacherName: teacherName || "",
      price: numericPrice,
      paymentMethod: isFree ? "Cash" : "Online",
      paymentStatus: isFree ? "Paid" : "Unpaid",
      orderStatus: "Pending", // Always set to Pending initially
      notes: "",
      paidAt: isFree ? new Date() : null
    });

    res.status(201).json({ 
      success: true, 
      message: isFree ? "Enrolled successfully! Waiting for admin approval." : "Booking created! Waiting for admin approval.",
      booking
    });
  } catch (err) {
    console.error("createBooking error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Server error" 
    });
  }
};

// GET /api/booking/my-bookings - Get user's bookings
export const getMyBookings = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const bookings = await Booking.findAll({
      where: { userId },
      include: [
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name', 'teacher', 'image']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json({ 
      success: true, 
      bookings
    });
  } catch (err) {
    console.error("getMyBookings error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PUT /api/booking/:bookingId/approve - Admin approves booking
export const approveBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findOne({
      where: { bookingId }
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    // Update booking status
    booking.orderStatus = "Completed";
    booking.paymentStatus = "Paid";
    booking.paidAt = new Date();
    
    await booking.save();

    res.json({ 
      success: true, 
      message: "Booking approved successfully",
      booking 
    });
  } catch (err) {
    console.error("approveBooking error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Server error" 
    });
  }
};

// PUT /api/booking/:bookingId/reject - Admin rejects booking
export const rejectBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { reason } = req.body;
    
    const booking = await Booking.findOne({
      where: { bookingId }
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    // Update booking status
    booking.orderStatus = "Cancelled";
    if (reason) {
      booking.notes = reason;
    }
    
    await booking.save();

    res.json({ 
      success: true, 
      message: "Booking rejected successfully",
      booking 
    });
  } catch (err) {
    console.error("rejectBooking error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Server error" 
    });
  }
};

// DELETE /api/booking/:bookingId - Delete a booking
export const deleteBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findOne({
      where: { bookingId }
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    await booking.destroy();

    res.json({ 
      success: true, 
      message: "Booking deleted successfully" 
    });
  } catch (err) {
    console.error("deleteBooking error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Server error" 
    });
  }
};

// GET /api/booking/:bookingId - Get single booking details
export const getBookingById = async (req, res) => {
  try {
    const { bookingId } = req.params;
    
    const booking = await Booking.findOne({
      where: { bookingId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Course,
          as: 'course',
          attributes: ['id', 'name', 'teacher', 'image']
        }
      ]
    });

    if (!booking) {
      return res.status(404).json({ 
        success: false, 
        message: "Booking not found" 
      });
    }

    res.json({ 
      success: true, 
      booking 
    });
  } catch (err) {
    console.error("getBookingById error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Server error" 
    });
  }
};

// GET /api/booking/stats - Get booking statistics (for admin dashboard)
export const getStats = async (req, res) => {
  try {
    // Total bookings count
    const totalBookings = await Booking.count();

    // Bookings by status
    const pendingBookings = await Booking.count({
      where: { orderStatus: "Pending" }
    });

    const completedBookings = await Booking.count({
      where: { orderStatus: "Completed" }
    });

    const cancelledBookings = await Booking.count({
      where: { orderStatus: "Cancelled" }
    });

    // Total revenue (only from completed/paid bookings)
    const revenueResult = await Booking.sum('price', {
      where: { 
        orderStatus: "Completed",
        paymentStatus: "Paid"
      }
    });
    const totalRevenue = revenueResult || 0;

    // Pending revenue (bookings waiting for approval)
    const pendingRevenueResult = await Booking.sum('price', {
      where: { orderStatus: "Pending" }
    });
    const pendingRevenue = pendingRevenueResult || 0;

    // Get recent bookings (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentBookings = await Booking.count({
      where: {
        createdAt: {
          [Op.gte]: sevenDaysAgo
        }
      }
    });

    // Get today's bookings
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayBookings = await Booking.count({
      where: {
        createdAt: {
          [Op.gte]: today
        }
      }
    });

    // Get most popular courses (by booking count)
    const popularCourses = await Booking.findAll({
      attributes: [
        'courseId',
        'courseName',
        [sequelize.fn('COUNT', sequelize.col('id')), 'bookingCount']
      ],
      where: {
        orderStatus: "Completed"
      },
      group: ['courseId', 'courseName'],
      order: [[sequelize.literal('"bookingCount"'), 'DESC']],
      limit: 5,
      raw: true
    });

    // Get revenue by course
    const revenueByProduct = await Booking.findAll({
      attributes: [
        'courseId',
        'courseName',
        [sequelize.fn('SUM', sequelize.col('price')), 'totalRevenue'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'bookingCount']
      ],
      where: {
        orderStatus: "Completed",
        paymentStatus: "Paid"
      },
      group: ['courseId', 'courseName'],
      order: [[sequelize.literal('"totalRevenue"'), 'DESC']],
      limit: 5,
      raw: true
    });

    // Calculate average booking value
    const avgBookingValue = completedBookings > 0 
      ? (totalRevenue / completedBookings).toFixed(2)
      : 0;

    res.json({
      success: true,
      stats: {
        overview: {
          totalBookings,
          pendingBookings,
          completedBookings,
          cancelledBookings,
          recentBookings, // Last 7 days
          todayBookings
        },
        revenue: {
          totalRevenue: parseFloat(totalRevenue.toFixed(2)),
          pendingRevenue: parseFloat(pendingRevenue.toFixed(2)),
          avgBookingValue: parseFloat(avgBookingValue)
        },
        topCourses: {
          byBookings: popularCourses,
          byRevenue: revenueByProduct
        }
      }
    });
  } catch (err) {
    console.error("getStats error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Server error" 
    });
  }
};

export default {
  getAllBookings,
  checkEnrollment,
  createBooking,
  getMyBookings,
  approveBooking,
  rejectBooking,
  deleteBooking,
  getBookingById,
  getStats

};