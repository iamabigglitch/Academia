import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock Booking model
const mockBooking = {
  findAll: jest.fn(),
  findOne: jest.fn(),
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

// Mock auth middleware
jest.unstable_mockModule("../Middleware/authmiddleware.js", () => ({
  protect: (req, res, next) => {
    req.user = { id: 1, role: "student" };
    next();
  },
}));

// Import controllers after mocking
const {
  getAllBookings,
  checkEnrollment,
  createBooking,
  getMyBookings,
  approveBooking,
  rejectBooking,
  getStats,
} = await import("../controllers/bookingController.js");

// Build test app (mirrors bookingRoute.js)
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  const protect = (req, res, next) => {
    req.user = { id: 1, role: "student" };
    next();
  };

  app.get("/booking/check/:id", protect, checkEnrollment);
  app.post("/booking/create", protect, createBooking);
  app.get("/booking/my-bookings", protect, getMyBookings);
  app.get("/booking/stats", protect, getStats);
  app.get("/booking", protect, getAllBookings);
  app.put("/booking/:bookingId/approve", approveBooking);
  app.put("/booking/:bookingId/reject", rejectBooking);

  return app;
};

describe("Booking Routes", () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /booking/check/:id", () => {
    it("should return enrolled true for completed booking", async () => {
      mockBooking.findOne.mockResolvedValue({
        orderStatus: "Completed",
        paymentStatus: "Paid",
      });

      const response = await request(app).get("/booking/check/uuid-course-1234");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.enrolled).toBe(true);
    });

    it("should return enrolled false if no booking", async () => {
      mockBooking.findOne.mockResolvedValue(null);

      const response = await request(app).get("/booking/check/uuid-course-1234");

      expect(response.status).toBe(200);
      expect(response.body.enrolled).toBe(false);
    });

    it("should return 500 on error", async () => {
      mockBooking.findOne.mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/booking/check/uuid-course-1234");

      expect(response.status).toBe(500);
    });
  });

  describe("POST /booking/create", () => {
    it("should create a free booking and return 201", async () => {
      mockUser.findByPk.mockResolvedValue({ id: 1, name: "Kasha KC" });
      mockBooking.findOne.mockResolvedValue(null);
      mockBooking.create.mockResolvedValue({
        id: 1,
        bookingId: "BK-1700000000000-1",
        orderStatus: "Pending",
        paymentStatus: "Paid",
      });

      const response = await request(app).post("/booking/create").send({
        courseId: "uuid-course-1234",
        courseName: "Introduction to JavaScript",
        teacherName: "Jenisha Regmi",
        price: 0,
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Enrolled successfully! Waiting for admin approval.");
    });

    it("should return 400 if courseId is missing", async () => {
      const response = await request(app).post("/booking/create").send({
        courseName: "JS Basics",
        price: 0,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("courseId and courseName are required");
    });

    it("should return 400 if already enrolled", async () => {
      mockUser.findByPk.mockResolvedValue({ id: 1, name: "Kasha KC" });
      mockBooking.findOne.mockResolvedValue({
        orderStatus: "Completed",
        paymentStatus: "Paid",
      });

      const response = await request(app).post("/booking/create").send({
        courseId: "uuid-course-1234",
        courseName: "JS Basics",
        price: 0,
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("You are already enrolled in this course");
    });

    it("should return 500 on error", async () => {
      mockUser.findByPk.mockRejectedValue(new Error("DB error"));

      const response = await request(app).post("/booking/create").send({
        courseId: "uuid-course-1234",
        courseName: "JS Basics",
        price: 0,
      });

      expect(response.status).toBe(500);
    });
  });

  describe("GET /booking/my-bookings", () => {
    it("should return user bookings with status 200", async () => {
      const myBookings = [
        { id: 1, bookingId: "BK-001", courseName: "JS Basics", orderStatus: "Completed" },
      ];
      mockBooking.findAll.mockResolvedValue(myBookings);

      const response = await request(app).get("/booking/my-bookings");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.bookings).toEqual(myBookings);
    });

    it("should return 500 on error", async () => {
      mockBooking.findAll.mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/booking/my-bookings");

      expect(response.status).toBe(500);
    });
  });

  describe("GET /booking", () => {
    it("should return all bookings with status 200", async () => {
      const allBookings = [
        { id: 1, bookingId: "BK-001", courseName: "JS Basics" },
        { id: 2, bookingId: "BK-002", courseName: "React Pro" },
      ];
      mockBooking.findAll.mockResolvedValue(allBookings);

      const response = await request(app).get("/booking");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.bookings).toEqual(allBookings);
    });

    it("should return 500 on error", async () => {
      mockBooking.findAll.mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/booking");

      expect(response.status).toBe(500);
    });
  });

  describe("PUT /booking/:bookingId/approve", () => {
    it("should approve a booking successfully", async () => {
      const mockBookingInstance = {
        bookingId: "BK-001",
        orderStatus: "Pending",
        paymentStatus: "Unpaid",
        paidAt: null,
        save: jest.fn().mockResolvedValue(true),
      };
      mockBooking.findOne.mockResolvedValue(mockBookingInstance);

      const response = await request(app).put("/booking/BK-001/approve");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Booking approved successfully");
    });

    it("should return 404 if booking not found", async () => {
      mockBooking.findOne.mockResolvedValue(null);

      const response = await request(app).put("/booking/BK-NOTFOUND/approve");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Booking not found");
    });
  });

  describe("PUT /booking/:bookingId/reject", () => {
    it("should reject a booking successfully", async () => {
      const mockBookingInstance = {
        bookingId: "BK-001",
        orderStatus: "Pending",
        notes: "",
        save: jest.fn().mockResolvedValue(true),
      };
      mockBooking.findOne.mockResolvedValue(mockBookingInstance);

      const response = await request(app)
        .put("/booking/BK-001/reject")
        .send({ reason: "Payment not received" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Booking rejected successfully");
    });

    it("should return 404 if booking not found", async () => {
      mockBooking.findOne.mockResolvedValue(null);

      const response = await request(app).put("/booking/BK-NOTFOUND/reject").send({});

      expect(response.status).toBe(404);
    });
  });

  describe("GET /booking/stats", () => {
    it("should return booking stats with status 200", async () => {
      mockBooking.count
        .mockResolvedValueOnce(100)
        .mockResolvedValueOnce(20)
        .mockResolvedValueOnce(70)
        .mockResolvedValueOnce(10)
        .mockResolvedValueOnce(15)
        .mockResolvedValueOnce(3);

      mockBooking.sum
        .mockResolvedValueOnce(84000)
        .mockResolvedValueOnce(24000);

      mockBooking.findAll
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([]);

      const response = await request(app).get("/booking/stats");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.stats.overview.totalBookings).toBe(100);
      expect(response.body.stats.revenue.totalRevenue).toBe(84000);
    });

    it("should return 500 on error", async () => {
      mockBooking.count.mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/booking/stats");

      expect(response.status).toBe(500);
    });
  });
});