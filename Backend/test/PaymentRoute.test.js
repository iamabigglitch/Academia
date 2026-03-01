import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock Booking model
const mockBooking = {
  findOne: jest.fn(),
  findAll: jest.fn(),
  create: jest.fn(),
};

// Mock User model
const mockUser = {
  findByPk: jest.fn(),
};

// Mock Course model
const mockCourse = {};

// Mock uuid
jest.unstable_mockModule("uuid", () => ({
  v4: jest.fn().mockReturnValue("abcd1234-efgh-ijkl-mnop-qrstuvwxyz00"),
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
const { processPayment, getPaymentHistory, verifyPayment, refundPayment } =
  await import("../controllers/paymentController.js");

// Build test app (mirrors paymentRoute.js)
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  const protect = (req, res, next) => {
    req.user = { id: 1, role: "student" };
    next();
  };

  app.post("/payment/process", protect, processPayment);
  app.get("/payment/history", protect, getPaymentHistory);
  app.get("/payment/verify/:transactionId", protect, verifyPayment);
  app.post("/payment/refund/:transactionId", protect, refundPayment);

  return app;
};

describe("Payment Routes", () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /payment/process", () => {
    it("should process a card payment and return 200", async () => {
      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue(null);
      mockBooking.create.mockResolvedValue({
        id: 1,
        bookingId: "BK-1700000000000-ABCD1234",
        orderStatus: "Pending",
        paymentStatus: "Paid",
        courseId: "uuid-course-1234",
      });

      const response = await request(app).post("/payment/process").send({
        paymentMethod: "card",
        amount: 1200,
        courseId: "uuid-course-1234",
        courseName: "Introduction to JavaScript",
        teacherName: "Jenisha Regmi",
        cardDetails: { cardNumber: "4111111111111234" },
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe(
        "Payment processed successfully. Your booking is pending admin approval."
      );
      expect(response.body.transactionId).toBeDefined();
    });

    it("should process a UPI payment and return 200", async () => {
      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue(null);
      mockBooking.create.mockResolvedValue({
        id: 2,
        bookingId: "BK-1700000000001-ABCD1234",
        orderStatus: "Pending",
        paymentStatus: "Paid",
        courseId: "uuid-course-1234",
      });

      const response = await request(app).post("/payment/process").send({
        paymentMethod: "upi",
        amount: 1200,
        courseId: "uuid-course-1234",
        courseName: "Introduction to JavaScript",
        teacherName: "Jenisha Regmi",
        upiId: "kasha@upi",
      });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 400 if required fields are missing", async () => {
      const response = await request(app).post("/payment/process").send({
        paymentMethod: "card",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Missing required payment information");
    });

    it("should return 400 for invalid payment method", async () => {
      const response = await request(app).post("/payment/process").send({
        paymentMethod: "crypto",
        amount: 1200,
        courseId: "uuid-course-1234",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Invalid payment method");
    });

    it("should return 400 if already enrolled", async () => {
      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue({ id: 1, paymentStatus: "Paid" });

      const response = await request(app).post("/payment/process").send({
        paymentMethod: "card",
        amount: 1200,
        courseId: "uuid-course-1234",
        cardDetails: { cardNumber: "4111111111111234" },
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("You are already enrolled in this course");
    });

    it("should return 400 if card details missing", async () => {
      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue(null);

      const response = await request(app).post("/payment/process").send({
        paymentMethod: "card",
        amount: 1200,
        courseId: "uuid-course-1234",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Card details are required");
    });

    it("should return 500 on server error", async () => {
      mockUser.findByPk.mockRejectedValue(new Error("DB error"));

      const response = await request(app).post("/payment/process").send({
        paymentMethod: "card",
        amount: 1200,
        courseId: "uuid-course-1234",
        cardDetails: { cardNumber: "4111111111111234" },
      });

      expect(response.status).toBe(500);
    });
  });

  describe("GET /payment/history", () => {
    it("should return payment history with status 200", async () => {
      const mockPayments = [
        { id: 1, bookingId: "BK-001", courseName: "JS Basics", paymentStatus: "Paid" },
        { id: 2, bookingId: "BK-002", courseName: "React Pro", paymentStatus: "Paid" },
      ];
      mockBooking.findAll.mockResolvedValue(mockPayments);

      const response = await request(app).get("/payment/history");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.payments).toEqual(mockPayments);
    });

    it("should return empty array if no payments", async () => {
      mockBooking.findAll.mockResolvedValue([]);

      const response = await request(app).get("/payment/history");

      expect(response.status).toBe(200);
      expect(response.body.payments).toEqual([]);
    });

    it("should return 500 on error", async () => {
      mockBooking.findAll.mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/payment/history");

      expect(response.status).toBe(500);
    });
  });

  describe("GET /payment/verify/:transactionId", () => {
    it("should verify a payment successfully", async () => {
      mockBooking.findOne.mockResolvedValue({
        id: 1,
        paymentStatus: "Paid",
        orderStatus: "Pending",
        paymentIntentId: "TXN-1700000000000-ABCD1234",
      });

      const response = await request(app).get(
        "/payment/verify/TXN-1700000000000-ABCD1234"
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.paymentStatus).toBe("Paid");
      expect(response.body.orderStatus).toBe("Pending");
    });

    it("should return 404 if payment not found", async () => {
      mockBooking.findOne.mockResolvedValue(null);

      const response = await request(app).get("/payment/verify/TXN-NOTFOUND");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Payment not found");
    });

    it("should return 500 on error", async () => {
      mockBooking.findOne.mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/payment/verify/TXN-001");

      expect(response.status).toBe(500);
    });
  });

  describe("POST /payment/refund/:transactionId", () => {
    it("should initiate refund successfully within 30 days", async () => {
      mockBooking.findOne.mockResolvedValue({
        id: 1,
        paymentStatus: "Paid",
        orderStatus: "Completed",
        paidAt: new Date(),
        update: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app).post(
        "/payment/refund/TXN-1700000000000-ABCD1234"
      );

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Refund initiated successfully");
    });

    it("should return 400 if payment is not paid", async () => {
      mockBooking.findOne.mockResolvedValue({
        id: 1,
        paymentStatus: "Unpaid",
        orderStatus: "Pending",
        paidAt: new Date(),
      });

      const response = await request(app).post(
        "/payment/refund/TXN-1700000000000-ABCD1234"
      );

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Payment is not in paid status");
    });

    it("should return 400 if refund requested after 30 days", async () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31);

      mockBooking.findOne.mockResolvedValue({
        id: 1,
        paymentStatus: "Paid",
        orderStatus: "Completed",
        paidAt: oldDate,
      });

      const response = await request(app).post(
        "/payment/refund/TXN-1700000000000-ABCD1234"
      );

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Refund can only be processed within 30 days");
    });

    it("should return 404 if payment not found", async () => {
      mockBooking.findOne.mockResolvedValue(null);

      const response = await request(app).post("/payment/refund/TXN-NOTFOUND");

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Payment not found");
    });

    it("should return 500 on error", async () => {
      mockBooking.findOne.mockRejectedValue(new Error("DB error"));

      const response = await request(app).post("/payment/refund/TXN-001");

      expect(response.status).toBe(500);
    });
  });
});