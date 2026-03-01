import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

// Mock User model
const mockUser = {
  findOne: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
};

// Mock bcrypt
jest.unstable_mockModule("bcryptjs", () => ({
  default: {
    compare: jest.fn(),
    hash: jest.fn(),
  },
}));

// Mock jwt utility
jest.unstable_mockModule("../Utills/jwt.js", () => ({
  generateToken: jest.fn().mockReturnValue("mock-jwt-token"),
}));

// Mock nodemailer
jest.unstable_mockModule("nodemailer", () => ({
  default: {
    createTransport: jest.fn().mockReturnValue({
      sendMail: jest.fn().mockResolvedValue(true),
    }),
  },
}));

// Mock User model module
jest.unstable_mockModule("../models/userModel.js", () => ({
  User: mockUser,
}));

// Mock auth middleware
jest.unstable_mockModule("../Middleware/authmiddleware.js", () => ({
  protect: (req, res, next) => {
    req.user = { id: 1, role: "student" };
    next();
  },
}));

// Mock multer
jest.unstable_mockModule("multer", () => {
  const multer = () => ({
    single: () => (req, res, next) => {
      req.file = null;
      next();
    },
  });
  multer.diskStorage = jest.fn();
  return { default: multer };
});

// Mock profile controller (not under test here)
jest.unstable_mockModule("../controllers/profileController.js", () => ({
  getProfile: (req, res) => res.status(200).json({ success: true }),
  updateProfile: (req, res) => res.status(200).json({ success: true }),
  deleteAccount: (req, res) => res.status(200).json({ success: true }),
}));

// Import controllers after mocking
const { signin, signUp, forgotPassword, changePassword } =
  await import("../controllers/authController.js");

const { default: bcrypt } = await import("bcryptjs");

// Build test app (mirrors authRoutes.js)
const createTestApp = () => {
  const app = express();
  app.use(express.json());

  const protect = (req, res, next) => {
    req.user = { id: 1, role: "student" };
    next();
  };

  app.post("/auth/signin", signin);
  app.post("/auth/signup", signUp);
  app.post("/auth/forgot-password", forgotPassword);
  app.put("/auth/change-password", protect, changePassword);

  return app;
};

describe("Auth Routes", () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("POST /auth/signin", () => {
    it("should login successfully and return token", async () => {
      mockUser.findOne.mockResolvedValue({
        id: 1,
        username: "kasha_kc",
        email: "kasha@academia.com",
        role: "student",
        password: "$2b$10$hashedpassword",
        profileImage: null,
      });
      bcrypt.compare.mockResolvedValue(true);

      const response = await request(app)
        .post("/auth/signin")
        .send({ username: "kasha_kc", password: "Pass1234" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBe("mock-jwt-token");
      expect(response.body.message).toBe("Logged in successfully");
    });

    it("should return 400 if username is missing", async () => {
      const response = await request(app)
        .post("/auth/signin")
        .send({ password: "Pass1234" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Username is required");
    });

    it("should return 401 if credentials are invalid", async () => {
      mockUser.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/signin")
        .send({ username: "unknown", password: "Pass1234" });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Invalid credentials");
    });

    it("should return 500 on server error", async () => {
      mockUser.findOne.mockRejectedValue(new Error("DB error"));

      const response = await request(app)
        .post("/auth/signin")
        .send({ username: "kasha_kc", password: "Pass1234" });

      expect(response.status).toBe(500);
    });
  });

  describe("POST /auth/signup", () => {
    it("should register a new user and return 201", async () => {
      mockUser.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("$2b$10$hashedpassword");
      mockUser.create.mockResolvedValue({
        id: 2,
        username: "newuser",
        email: "new@academia.com",
        role: "student",
        profileImage: null,
      });

      const response = await request(app).post("/auth/signup").send({
        username: "newuser",
        email: "new@academia.com",
        password: "Pass1234",
        number: "9811111111",
        role: "student",
      });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.token).toBe("mock-jwt-token");
      expect(response.body.message).toBe("Account created successfully");
    });

    it("should return 400 if fields are missing", async () => {
      const response = await request(app)
        .post("/auth/signup")
        .send({ email: "new@academia.com" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("All fields are required");
    });

    it("should return 400 if email already registered", async () => {
      mockUser.findOne.mockResolvedValueOnce({ id: 1, email: "kasha@academia.com" });

      const response = await request(app).post("/auth/signup").send({
        username: "kasha_kc",
        email: "kasha@academia.com",
        password: "Pass1234",
        number: "9800000000",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email already registered");
    });

    it("should return 400 if password is too weak", async () => {
      mockUser.findOne.mockResolvedValue(null);

      const response = await request(app).post("/auth/signup").send({
        username: "newuser",
        email: "new@academia.com",
        password: "abc",
        number: "9811111111",
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /auth/forgot-password", () => {
    it("should return 200 for valid email", async () => {
      mockUser.findOne.mockResolvedValue({
        email: "kasha@academia.com",
        username: "kasha_kc",
        googleId: null,
        password: "$2b$10$hashedpassword",
        resetToken: null,
        resetTokenExpiry: null,
        save: jest.fn().mockResolvedValue(true),
      });

      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "kasha@academia.com" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 200 even if email not found (security)", async () => {
      mockUser.findOne.mockResolvedValue(null);

      const response = await request(app)
        .post("/auth/forgot-password")
        .send({ email: "notfound@academia.com" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it("should return 400 if email is missing", async () => {
      const response = await request(app)
        .post("/auth/forgot-password")
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Email is required");
    });
  });

  describe("PUT /auth/change-password", () => {
    it("should change password successfully", async () => {
      mockUser.findByPk.mockResolvedValue({
        id: 1,
        password: "$2b$10$oldhashedpassword",
        googleId: null,
        save: jest.fn().mockResolvedValue(true),
      });
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("$2b$10$newhashedpassword");

      const response = await request(app)
        .put("/auth/change-password")
        .send({
          currentPassword: "OldPass1",
          newPassword: "NewPass1",
          confirmPassword: "NewPass1",
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Password changed successfully");
    });

    it("should return 400 if fields are missing", async () => {
      const response = await request(app)
        .put("/auth/change-password")
        .send({ currentPassword: "OldPass1" });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("All password fields are required");
    });

    it("should return 400 if new passwords do not match", async () => {
      const response = await request(app)
        .put("/auth/change-password")
        .send({
          currentPassword: "OldPass1",
          newPassword: "NewPass1",
          confirmPassword: "Different1",
        });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("New passwords do not match");
    });

    it("should return 401 if current password is incorrect", async () => {
      mockUser.findByPk.mockResolvedValue({
        id: 1,
        password: "$2b$10$hashedpassword",
        googleId: null,
      });
      bcrypt.compare.mockResolvedValue(false);

      const response = await request(app)
        .put("/auth/change-password")
        .send({
          currentPassword: "WrongPass1",
          newPassword: "NewPass1",
          confirmPassword: "NewPass1",
        });

      expect(response.status).toBe(401);
      expect(response.body.message).toBe("Current password is incorrect");
    });
  });
});