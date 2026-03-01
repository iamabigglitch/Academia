import { jest } from "@jest/globals";

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

// Import controller after mocking
const { processPayment, getPaymentHistory, verifyPayment, refundPayment } =
  await import("../controllers/paymentController.js");

describe("Payment Controller", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("processPayment", () => {
    it("should process a card payment successfully", async () => {
      const req = {
        user: { id: 1 },
        body: {
          paymentMethod: "card",
          amount: 1200,
          courseId: "uuid-course-1234",
          courseName: "Introduction to JavaScript",
          teacherName: "Jenisha Regmi",
          cardDetails: { cardNumber: "4111111111111234" },
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue(null);
      mockBooking.create.mockResolvedValue({
        id: 1,
        bookingId: "BK-1700000000000-ABCD1234",
        orderStatus: "Pending",
        paymentStatus: "Paid",
        courseId: "uuid-course-1234",
      });

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Payment processed successfully. Your booking is pending admin approval.",
        })
      );
    });

    it("should process a UPI payment successfully", async () => {
      const req = {
        user: { id: 1 },
        body: {
          paymentMethod: "upi",
          amount: 1200,
          courseId: "uuid-course-1234",
          courseName: "Introduction to JavaScript",
          teacherName: "Jenisha Regmi",
          upiId: "kasha@upi",
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue(null);
      mockBooking.create.mockResolvedValue({
        id: 2,
        bookingId: "BK-1700000000001-ABCD1234",
        orderStatus: "Pending",
        paymentStatus: "Paid",
        courseId: "uuid-course-1234",
      });

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should process a netbanking payment successfully", async () => {
      const req = {
        user: { id: 1 },
        body: {
          paymentMethod: "netbanking",
          amount: 1200,
          courseId: "uuid-course-1234",
          courseName: "Introduction to JavaScript",
          teacherName: "Jenisha Regmi",
          bank: "SBI",
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue(null);
      mockBooking.create.mockResolvedValue({
        id: 3,
        bookingId: "BK-1700000000002-ABCD1234",
        orderStatus: "Pending",
        paymentStatus: "Paid",
        courseId: "uuid-course-1234",
      });

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should return 400 if required fields are missing", async () => {
      const req = {
        user: { id: 1 },
        body: { paymentMethod: "card" },
      };
      const res = mockResponse();

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Missing required payment information",
      });
    });

    it("should return 400 for invalid payment method", async () => {
      const req = {
        user: { id: 1 },
        body: { paymentMethod: "crypto", amount: 1200, courseId: "uuid-course-1234" },
      };
      const res = mockResponse();

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid payment method",
      });
    });

    it("should return 404 if user not found", async () => {
      const req = {
        user: { id: 999 },
        body: {
          paymentMethod: "card",
          amount: 1200,
          courseId: "uuid-course-1234",
          cardDetails: { cardNumber: "4111111111111234" },
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue(null);

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User not found",
      });
    });

    it("should return 400 if user already enrolled", async () => {
      const req = {
        user: { id: 1 },
        body: {
          paymentMethod: "card",
          amount: 1200,
          courseId: "uuid-course-1234",
          cardDetails: { cardNumber: "4111111111111234" },
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue({ id: 1, paymentStatus: "Paid" });

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "You are already enrolled in this course",
      });
    });

    it("should return 400 if card details missing for card payment", async () => {
      const req = {
        user: { id: 1 },
        body: {
          paymentMethod: "card",
          amount: 1200,
          courseId: "uuid-course-1234",
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue(null);

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Card details are required",
      });
    });

    it("should return 400 if UPI ID missing for upi payment", async () => {
      const req = {
        user: { id: 1 },
        body: { paymentMethod: "upi", amount: 1200, courseId: "uuid-course-1234" },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue(null);

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "UPI ID is required",
      });
    });

    it("should return 400 if bank missing for netbanking payment", async () => {
      const req = {
        user: { id: 1 },
        body: { paymentMethod: "netbanking", amount: 1200, courseId: "uuid-course-1234" },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({ id: 1, username: "kasha_kc" });
      mockBooking.findOne.mockResolvedValue(null);

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Bank selection is required",
      });
    });

    it("should return 500 on server error", async () => {
      const req = {
        user: { id: 1 },
        body: {
          paymentMethod: "card",
          amount: 1200,
          courseId: "uuid-course-1234",
          cardDetails: { cardNumber: "4111111111111234" },
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockRejectedValue(new Error("DB error"));

      await processPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getPaymentHistory", () => {
    it("should return payment history successfully", async () => {
      const req = { user: { id: 1 } };
      const res = mockResponse();

      const mockPayments = [
        { id: 1, bookingId: "BK-001", courseName: "JS Basics", paymentStatus: "Paid", paidAt: new Date("2024-01-15") },
        { id: 2, bookingId: "BK-002", courseName: "React Pro", paymentStatus: "Paid", paidAt: new Date("2024-02-10") },
      ];
      mockBooking.findAll.mockResolvedValue(mockPayments);

      await getPaymentHistory(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, payments: mockPayments });
    });

    it("should return empty array if no payments found", async () => {
      const req = { user: { id: 1 } };
      const res = mockResponse();

      mockBooking.findAll.mockResolvedValue([]);

      await getPaymentHistory(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, payments: [] });
    });

    it("should return 500 on error", async () => {
      const req = { user: { id: 1 } };
      const res = mockResponse();

      mockBooking.findAll.mockRejectedValue(new Error("DB error"));

      await getPaymentHistory(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("verifyPayment", () => {
    it("should verify a payment successfully", async () => {
      const req = { user: { id: 1 }, params: { transactionId: "TXN-1700000000000-ABCD1234" } };
      const res = mockResponse();

      const mockBookingData = {
        id: 1,
        paymentStatus: "Paid",
        orderStatus: "Pending",
        paymentIntentId: "TXN-1700000000000-ABCD1234",
      };
      mockBooking.findOne.mockResolvedValue(mockBookingData);

      await verifyPayment(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          paymentStatus: "Paid",
          orderStatus: "Pending",
        })
      );
    });

    it("should return 404 if payment not found", async () => {
      const req = { user: { id: 1 }, params: { transactionId: "TXN-NOTFOUND" } };
      const res = mockResponse();

      mockBooking.findOne.mockResolvedValue(null);

      await verifyPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Payment not found" });
    });

    it("should return 500 on error", async () => {
      const req = { user: { id: 1 }, params: { transactionId: "TXN-001" } };
      const res = mockResponse();

      mockBooking.findOne.mockRejectedValue(new Error("DB error"));

      await verifyPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("refundPayment", () => {
    it("should initiate refund successfully within 30 days", async () => {
      const req = { user: { id: 1 }, params: { transactionId: "TXN-1700000000000-ABCD1234" } };
      const res = mockResponse();

      const mockBookingData = {
        id: 1,
        paymentStatus: "Paid",
        orderStatus: "Completed",
        paidAt: new Date(), // today — within 30 days
        update: jest.fn().mockResolvedValue(true),
      };
      mockBooking.findOne.mockResolvedValue(mockBookingData);

      await refundPayment(req, res);

      expect(mockBookingData.update).toHaveBeenCalledWith({
        paymentStatus: "Paid",
        orderStatus: "Cancelled",
      });
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Refund initiated successfully",
        })
      );
    });

    it("should return 400 if payment is not in paid status", async () => {
      const req = { user: { id: 1 }, params: { transactionId: "TXN-1700000000000-ABCD1234" } };
      const res = mockResponse();

      mockBooking.findOne.mockResolvedValue({
        id: 1,
        paymentStatus: "Unpaid",
        orderStatus: "Pending",
        paidAt: new Date(),
      });

      await refundPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Payment is not in paid status",
      });
    });

    it("should return 400 if refund requested after 30 days", async () => {
      const req = { user: { id: 1 }, params: { transactionId: "TXN-1700000000000-ABCD1234" } };
      const res = mockResponse();

      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31); // 31 days ago

      mockBooking.findOne.mockResolvedValue({
        id: 1,
        paymentStatus: "Paid",
        orderStatus: "Completed",
        paidAt: oldDate,
      });

      await refundPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Refund can only be processed within 30 days",
      });
    });

    it("should return 404 if payment not found", async () => {
      const req = { user: { id: 1 }, params: { transactionId: "TXN-NOTFOUND" } };
      const res = mockResponse();

      mockBooking.findOne.mockResolvedValue(null);

      await refundPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Payment not found" });
    });

    it("should return 500 on error", async () => {
      const req = { user: { id: 1 }, params: { transactionId: "TXN-001" } };
      const res = mockResponse();

      mockBooking.findOne.mockRejectedValue(new Error("DB error"));

      await refundPayment(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});