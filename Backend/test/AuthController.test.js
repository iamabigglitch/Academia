import { jest } from "@jest/globals";

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

// Import controller after mocking
const { signin, signUp, forgotPassword, resetPassword, verifyResetToken, changePassword } =
  await import("../controllers/authController.js");

const { default: bcrypt } = await import("bcryptjs");

describe("Auth Controller", () => {
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signin", () => {
    it("should login successfully with valid credentials", async () => {
      const req = { body: { username: "kasha_kc", password: "Pass1234" } };
      const res = mockResponse();

      const mockUserData = {
        id: 1,
        username: "kasha_kc",
        email: "kasha@academia.com",
        role: "student",
        password: "$2b$10$hashedpassword",
        profileImage: null,
      };

      mockUser.findOne.mockResolvedValue(mockUserData);
      bcrypt.compare.mockResolvedValue(true);

      await signin(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: "mock-jwt-token",
          message: "Logged in successfully",
        })
      );
    });

    it("should return 400 if username is missing", async () => {
      const req = { body: { password: "Pass1234" } };
      const res = mockResponse();

      await signin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Username is required" });
    });

    it("should return 400 if password is missing", async () => {
      const req = { body: { username: "kasha_kc" } };
      const res = mockResponse();

      await signin(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Password is required" });
    });

    it("should return 401 if user not found", async () => {
      const req = { body: { username: "unknown", password: "Pass1234" } };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);

      await signin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid credentials" });
    });

    it("should return 401 if password does not match", async () => {
      const req = { body: { username: "kasha_kc", password: "WrongPass1" } };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue({ id: 1, password: "$2b$10$hashedpassword" });
      bcrypt.compare.mockResolvedValue(false);

      await signin(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Invalid credentials" });
    });

    it("should return 500 on server error", async () => {
      const req = { body: { username: "kasha_kc", password: "Pass1234" } };
      const res = mockResponse();

      mockUser.findOne.mockRejectedValue(new Error("DB error"));

      await signin(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("signUp", () => {
    it("should register a new user successfully", async () => {
      const req = {
        body: {
          username: "newuser",
          email: "new@academia.com",
          password: "Pass1234",
          number: "9811111111",
          role: "student",
        },
      };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("$2b$10$hashedpassword");
      mockUser.create.mockResolvedValue({
        id: 2,
        username: "newuser",
        email: "new@academia.com",
        role: "student",
        profileImage: null,
      });

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: "mock-jwt-token",
          message: "Account created successfully",
        })
      );
    });

    it("should return 400 if required fields are missing", async () => {
      const req = { body: { email: "new@academia.com" } };
      const res = mockResponse();

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "All fields are required" });
    });

    it("should return 400 if email already registered", async () => {
      const req = {
        body: {
          username: "kasha_kc",
          email: "kasha@academia.com",
          password: "Pass1234",
          number: "9800000000",
        },
      };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValueOnce({ id: 1, email: "kasha@academia.com" });

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Email already registered" });
    });

    it("should return 400 if username already taken", async () => {
      const req = {
        body: {
          username: "kasha_kc",
          email: "new@academia.com",
          password: "Pass1234",
          number: "9811111111",
        },
      };
      const res = mockResponse();

      mockUser.findOne
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 1, username: "kasha_kc" });

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Username already taken" });
    });

    it("should return 400 if password is too weak", async () => {
      const req = {
        body: {
          username: "newuser",
          email: "new@academia.com",
          password: "abc",
          number: "9811111111",
        },
      };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it("should return 500 on server error", async () => {
      const req = {
        body: {
          username: "newuser",
          email: "new@academia.com",
          password: "Pass1234",
          number: "9811111111",
        },
      };
      const res = mockResponse();

      mockUser.findOne.mockRejectedValue(new Error("DB error"));

      await signUp(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("forgotPassword", () => {
    it("should send reset email for valid user", async () => {
      const req = { body: { email: "kasha@academia.com" } };
      const res = mockResponse();

      const mockUserData = {
        email: "kasha@academia.com",
        username: "kasha_kc",
        googleId: null,
        password: "$2b$10$hashedpassword",
        resetToken: null,
        resetTokenExpiry: null,
        save: jest.fn().mockResolvedValue(true),
      };

      mockUser.findOne.mockResolvedValue(mockUserData);

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should return 200 even if email not found (security)", async () => {
      const req = { body: { email: "notfound@academia.com" } };
      const res = mockResponse();

      mockUser.findOne.mockResolvedValue(null);

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should return 400 if email is missing", async () => {
      const req = { body: {} };
      const res = mockResponse();

      await forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Email is required" });
    });
  });

  describe("changePassword", () => {
    it("should change password successfully", async () => {
      const req = {
        user: { id: 1 },
        body: {
          currentPassword: "OldPass1",
          newPassword: "NewPass1",
          confirmPassword: "NewPass1",
        },
      };
      const res = mockResponse();

      const mockUserData = {
        id: 1,
        password: "$2b$10$oldhashedpassword",
        googleId: null,
        save: jest.fn().mockResolvedValue(true),
      };

      mockUser.findByPk.mockResolvedValue(mockUserData);
      bcrypt.compare.mockResolvedValue(true);
      bcrypt.hash.mockResolvedValue("$2b$10$newhashedpassword");

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Password changed successfully" });
    });

    it("should return 400 if fields are missing", async () => {
      const req = { user: { id: 1 }, body: { currentPassword: "OldPass1" } };
      const res = mockResponse();

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "All password fields are required" });
    });

    it("should return 400 if new passwords do not match", async () => {
      const req = {
        user: { id: 1 },
        body: {
          currentPassword: "OldPass1",
          newPassword: "NewPass1",
          confirmPassword: "Different1",
        },
      };
      const res = mockResponse();

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "New passwords do not match" });
    });

    it("should return 400 if new password is same as current", async () => {
      const req = {
        user: { id: 1 },
        body: {
          currentPassword: "SamePass1",
          newPassword: "SamePass1",
          confirmPassword: "SamePass1",
        },
      };
      const res = mockResponse();

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "New password must be different from current password",
      });
    });

    it("should return 401 if current password is incorrect", async () => {
      const req = {
        user: { id: 1 },
        body: {
          currentPassword: "WrongPass1",
          newPassword: "NewPass1",
          confirmPassword: "NewPass1",
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue({
        id: 1,
        password: "$2b$10$hashedpassword",
        googleId: null,
      });
      bcrypt.compare.mockResolvedValue(false);

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ message: "Current password is incorrect" })
      );
    });

    it("should return 404 if user not found", async () => {
      const req = {
        user: { id: 999 },
        body: {
          currentPassword: "OldPass1",
          newPassword: "NewPass1",
          confirmPassword: "NewPass1",
        },
      };
      const res = mockResponse();

      mockUser.findByPk.mockResolvedValue(null);

      await changePassword(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "User not found" });
    });
  });
});