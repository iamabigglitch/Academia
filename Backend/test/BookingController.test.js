import { jest } from "@jest/globals";

// Mock Booking model
const mockBooking = {
  findAll: jest.fn(),
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
  sum: jest.fn(),
};

// Mock User model
const mockUser = {
  findByPk: jest.fn(),
};

// Mock Course model
const mockCourse = {};

// Mock sequelize
jest.unstable_mockModule("../database/db.js", () => ({
  sequelize: {
    fn: jest.fn(),
    col: jest.fn(),
    literal: jest.fn(),
  },
}));

jest.unstable_mockModule("../models/bookingModel.js", () => ({
  Booking: mockBooking,
}));

jest.unstable_mockModule("../models/userModel.js", () => ({
  User: mockUser,
}));

jest.unstable_mockModule("../models/courseModel.js", () => ({
  default: mockCourse,
}));

// Import controller after mocking
const {
  getAllBookings,
  checkEnrollment,
  createBooking,
  getMyBookings,
  approveBooking,
  rejectBooking,
  deleteBooking,
  getBookingById,
  getStats,
} = await import("../controllers/bookingController.js");

describe("Booking Controller", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllBookings", () => {
    it("should return all bookings with status 200", async () => {
      const req = { query: {} };
      const res = mockResponse();

      const mockBookings = [
        { id: 1, bookingId: "BK-001", courseName: "JS Basics", orderStatus: "Completed" },
        { id: 2, bookingId: "BK-002", courseName: "React Pro", orderStatus: "Pending" },
      ];
      mockBooking.findAll.mockResolvedValue(mockBookings);

      await getAllBookings(req, res);

      expect(mockBooking.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, bookings: mockBookings })
      );
    });

    it("should return 500 on error", async () => {
      const req = { query: {} };
      const res = mockResponse();

      mockBooking.findAll.mockRejectedValue(new Error("DB error"));

      await getAllBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("checkEnrollment", () => {
    it("should return enrolled true for completed and paid booking", async () => {
      const req = { user: { id: 1 }, params: { id: "uuid-course-1234" } };
      const res = mockResponse();

      mockBooking.findOne.mockResolvedValue({
        id: 1,
        orderStatus: "Completed",
        paymentStatus: "Paid",
      });

      await checkEnrollment(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, enrolled: true })
      );
    });

    it("should return enrolled false for pending booking", async () => {
      const req = { user: { id: 1 }, params: { id: "uuid-course-1234" } };
      const res = mockResponse();

      mockBooking.findOne.mockResolvedValue({
        id: 1,
        orderStatus: "Pending",
        paymentStatus: "Unpaid",
      });

      await checkEnrollment(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, enrolled: false })
      );
    });

    it("should return enrolled false if no booking found", async () => {
      const req = { user: { id: 1 }, params: { id: "uuid-course-1234" } };
      const res = mockResponse();

      mockBooking.findOne.mockResolvedValue(null);

      await checkEnrollment(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, enrolled: false })
      );
    });

    it("should return 500 on error", async () => {
      const req = { user: { id: 1 }, params: { id: "uuid-course-1234" } };
      const res = mockResponse();

      mockBooking.findOne.mockRejectedValue(new Error("DB error"));

      await checkEnrollment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("createBooking", () => {
    it("should create a free booking successfully", async () => {
      const req = {
        user: { id: 1 },
        body: {
          courseId: "uuid-course-1234",
          courseName: "Introduction to JavaScript",
          teacherName: "Jenisha Regmi",
          price: 0,
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({ id: 1, name: "Kasha KC" });
      mockBooking.findOne.mockResolvedValue(null);
      mockBooking.create.mockResolvedValue({
        id: 1,
        bookingId: "BK-1700000000000-1",
        orderStatus: "Pending",
        paymentStatus: "Paid",
      });

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Enrolled successfully! Waiting for admin approval.",
        })
      );
    });

    it("should create a paid booking successfully", async () => {
      const req = {
        user: { id: 1 },
        body: {
          courseId: "uuid-course-1234",
          courseName: "Advanced React",
          teacherName: "Smarika Sitaula",
          price: 1200,
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({ id: 1, name: "Kasha KC" });
      mockBooking.findOne.mockResolvedValue(null);
      mockBooking.create.mockResolvedValue({
        id: 2,
        bookingId: "BK-1700000000001-1",
        orderStatus: "Pending",
        paymentStatus: "Unpaid",
      });

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Booking created! Waiting for admin approval.",
        })
      );
    });

    it("should return 401 if user is not authenticated", async () => {
      const req = { user: null, body: {} };
      const res = mockResponse();

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Unauthorized" });
    });

    it("should return 400 if courseId or courseName is missing", async () => {
      const req = { user: { id: 1 }, body: { price: 0 } };
      const res = mockResponse();

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "courseId and courseName are required",
      });
    });

    it("should return 400 if user is already enrolled", async () => {
      const req = {
        user: { id: 1 },
        body: {
          courseId: "uuid-course-1234",
          courseName: "JS Basics",
          price: 0,
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({ id: 1, name: "Kasha KC" });
      mockBooking.findOne.mockResolvedValue({
        orderStatus: "Completed",
        paymentStatus: "Paid",
      });

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "You are already enrolled in this course",
      });
    });

    it("should return existing pending booking", async () => {
      const req = {
        user: { id: 1 },
        body: {
          courseId: "uuid-course-1234",
          courseName: "JS Basics",
          price: 0,
        },
      };
      const res = mockResponse();

      const pendingBooking = { id: 1, orderStatus: "Pending", paymentStatus: "Unpaid" };
      mockUser.findByPk.mockResolvedValue({ id: 1, name: "Kasha KC" });
      mockBooking.findOne.mockResolvedValue(pendingBooking);

      await createBooking(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "You already have a pending booking for this course",
          booking: pendingBooking,
        })
      );
    });

    it("should return 404 if user not found", async () => {
      const req = {
        user: { id: 999 },
        body: { courseId: "uuid-1234", courseName: "JS Basics", price: 0 },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue(null);

      await createBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "User not found" });
    });
  });

  describe("getMyBookings", () => {
    it("should return user bookings successfully", async () => {
      const req = { user: { id: 1 } };
      const res = mockResponse();

      const myBookings = [
        { id: 1, bookingId: "BK-001", courseName: "JS Basics", orderStatus: "Completed" },
      ];
      mockBooking.findAll.mockResolvedValue(myBookings);

      await getMyBookings(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, bookings: myBookings });
    });

    it("should return 401 if user not authenticated", async () => {
      const req = { user: null };
      const res = mockResponse();

      await getMyBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
    });

    it("should return 500 on error", async () => {
      const req = { user: { id: 1 } };
      const res = mockResponse();

      mockBooking.findAll.mockRejectedValue(new Error("DB error"));

      await getMyBookings(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("approveBooking", () => {
    it("should approve a booking successfully", async () => {
      const req = { params: { bookingId: "BK-001" } };
      const res = mockResponse();

      const mockBookingInstance = {
        bookingId: "BK-001",
        orderStatus: "Pending",
        paymentStatus: "Unpaid",
        paidAt: null,
        save: jest.fn().mockResolvedValue(true),
      };
      mockBooking.findOne.mockResolvedValue(mockBookingInstance);

      await approveBooking(req, res);

      expect(mockBookingInstance.orderStatus).toBe("Completed");
      expect(mockBookingInstance.paymentStatus).toBe("Paid");
      expect(mockBookingInstance.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: "Booking approved successfully" })
      );
    });

    it("should return 404 if booking not found", async () => {
      const req = { params: { bookingId: "BK-NOTFOUND" } };
      const res = mockResponse();

      mockBooking.findOne.mockResolvedValue(null);

      await approveBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Booking not found" });
    });
  });

  describe("rejectBooking", () => {
    it("should reject a booking successfully", async () => {
      const req = { params: { bookingId: "BK-001" }, body: { reason: "Payment not received" } };
      const res = mockResponse();

      const mockBookingInstance = {
        bookingId: "BK-001",
        orderStatus: "Pending",
        notes: "",
        save: jest.fn().mockResolvedValue(true),
      };
      mockBooking.findOne.mockResolvedValue(mockBookingInstance);

      await rejectBooking(req, res);

      expect(mockBookingInstance.orderStatus).toBe("Cancelled");
      expect(mockBookingInstance.notes).toBe("Payment not received");
      expect(mockBookingInstance.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true, message: "Booking rejected successfully" })
      );
    });

    it("should return 404 if booking not found", async () => {
      const req = { params: { bookingId: "BK-NOTFOUND" }, body: {} };
      const res = mockResponse();

      mockBooking.findOne.mockResolvedValue(null);

      await rejectBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("deleteBooking", () => {
    it("should delete a booking successfully", async () => {
      const req = { params: { bookingId: "BK-001" } };
      const res = mockResponse();

      const mockBookingInstance = {
        bookingId: "BK-001",
        destroy: jest.fn().mockResolvedValue(true),
      };
      mockBooking.findOne.mockResolvedValue(mockBookingInstance);

      await deleteBooking(req, res);

      expect(mockBookingInstance.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Booking deleted successfully" });
    });

    it("should return 404 if booking not found", async () => {
      const req = { params: { bookingId: "BK-NOTFOUND" } };
      const res = mockResponse();

      mockBooking.findOne.mockResolvedValue(null);

      await deleteBooking(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getBookingById", () => {
    it("should return a booking by bookingId", async () => {
      const req = { params: { bookingId: "BK-001" } };
      const res = mockResponse();

      const mockBookingData = {
        id: 1,
        bookingId: "BK-001",
        courseName: "JS Basics",
        orderStatus: "Completed",
      };
      mockBooking.findOne.mockResolvedValue(mockBookingData);

      await getBookingById(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, booking: mockBookingData });
    });

    it("should return 404 if booking not found", async () => {
      const req = { params: { bookingId: "BK-NOTFOUND" } };
      const res = mockResponse();

      mockBooking.findOne.mockResolvedValue(null);

      await getBookingById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getStats", () => {
    it("should return booking statistics successfully", async () => {
      const req = {};
      const res = mockResponse();

      mockBooking.count
        .mockResolvedValueOnce(100)   // totalBookings
        .mockResolvedValueOnce(20)    // pendingBookings
        .mockResolvedValueOnce(70)    // completedBookings
        .mockResolvedValueOnce(10)    // cancelledBookings
        .mockResolvedValueOnce(15)    // recentBookings
        .mockResolvedValueOnce(3);    // todayBookings

      mockBooking.sum
        .mockResolvedValueOnce(84000) // totalRevenue
        .mockResolvedValueOnce(24000); // pendingRevenue

      mockBooking.findAll
        .mockResolvedValueOnce([])    // popularCourses
        .mockResolvedValueOnce([]);   // revenueByProduct

      await getStats(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          stats: expect.objectContaining({
            overview: expect.objectContaining({
              totalBookings: 100,
              pendingBookings: 20,
              completedBookings: 70,
              cancelledBookings: 10,
            }),
            revenue: expect.objectContaining({
              totalRevenue: 84000,
              pendingRevenue: 24000,
            }),
          }),
        })
      );
    });

    it("should return 500 on error", async () => {
      const req = {};
      const res = mockResponse();

      mockBooking.count.mockRejectedValue(new Error("DB error"));

      await getStats(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});