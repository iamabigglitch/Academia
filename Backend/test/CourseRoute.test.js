import { jest } from "@jest/globals";
import express from "express";
import request from "supertest";

const mockCourse = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
};

const mockLecture = {
  create: jest.fn(),
  findAll: jest.fn(),
};

const mockChapter = {
  create: jest.fn(),
};

const mockRating = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
};

const mockBooking = {};

jest.unstable_mockModule("../models/courseModel.js", () => ({
  default: mockCourse,
}));

jest.unstable_mockModule("../models/lectureModel.js", () => ({
  default: mockLecture,
}));

jest.unstable_mockModule("../models/chapterModel.js", () => ({
  default: mockChapter,
}));

jest.unstable_mockModule("../models/ratingModel.js", () => ({
  default: mockRating,
}));

jest.unstable_mockModule("../models/bookingModel.js", () => ({
  Booking: mockBooking,
}));

jest.unstable_mockModule("../uploads/academiauploads.js", () => ({
  makeImageAbsolute: jest.fn((image) => `http://localhost:5000${image}`),
}));

jest.unstable_mockModule("fs", () => ({
  default: {
    existsSync: jest.fn().mockReturnValue(false),
    unlinkSync: jest.fn(),
  },
}));

// Mock auth middleware — bypass authentication
jest.unstable_mockModule("../Middleware/authmiddleware.js", () => ({
  protect: (req, res, next) => {
    req.user = { id: "user-1", role: "student" };
    next();
  },
}));

// Mock multer — skip actual file upload
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

// Import controller functions after mocking
const {
  getPublicCourses,
  getCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  rateCourse,
  getMyRating,
} = await import("../controllers/courseController.js");

const createTestApp = () => {
  const app = express();
  app.use(express.json());

  // Inject authenticated user for protected routes
  const protect = (req, res, next) => {
    req.user = { id: "user-1", role: "student" };
    next();
  };

  // Mock multer middleware
  const uploadSingle = (req, res, next) => {
    req.file = null;
    next();
  };

  // Public routes
  app.get("/courses/public", getPublicCourses);
  app.get("/courses", getCourses);
  app.get("/courses/:id", getCourseById);

  // Protected routes
  app.post("/courses/:courseId/rate", protect, rateCourse);
  app.get("/courses/:courseId/my-rating", protect, getMyRating);
  app.post("/courses", protect, uploadSingle, createCourse);
  app.delete("/courses/:id", protect, deleteCourse);

  return app;
};

describe("Course Routes", () => {
  let app;

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET /courses/public", () => {
    it("should return all public courses with status 200", async () => {
      const mockCourses = [
        { toJSON: () => ({ id: "1", name: "JS Basics", image: "/uploads/js.jpg", courseType: "regular" }) },
        { toJSON: () => ({ id: "2", name: "React Pro", image: "/uploads/react.jpg", courseType: "top" }) },
      ];
      mockCourse.findAll.mockResolvedValue(mockCourses);

      const response = await request(app).get("/courses/public");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.items).toHaveLength(2);
    });

    it("should return only 'top' courses when type=top", async () => {
      const mockCourses = [
        { toJSON: () => ({ id: "2", name: "React Pro", image: "/uploads/react.jpg", courseType: "top" }) },
      ];
      mockCourse.findAll.mockResolvedValue(mockCourses);

      const response = await request(app).get("/courses/public").query({ type: "top" });

      expect(response.status).toBe(200);
      expect(mockCourse.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { courseType: "top" } })
      );
    });

    it("should return only 'regular' courses when type=regular", async () => {
      mockCourse.findAll.mockResolvedValue([]);

      const response = await request(app).get("/courses/public").query({ type: "regular" });

      expect(response.status).toBe(200);
      expect(mockCourse.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ where: { courseType: "regular" } })
      );
    });

    it("should return 500 on database error", async () => {
      mockCourse.findAll.mockRejectedValue(new Error("DB connection failed"));

      const response = await request(app).get("/courses/public");

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /courses", () => {
    it("should return all courses with booking stats and status 200", async () => {
      const mockCourseData = {
        toJSON: () => ({
          id: "1",
          name: "JS Basics",
          image: "/uploads/js.jpg",
          Bookings: [
            { paymentStatus: "Paid", orderStatus: "Completed", price: 1000 },
            { paymentStatus: "Paid", orderStatus: "Completed", price: 2000 },
          ],
        }),
      };
      mockCourse.findAll.mockResolvedValue([mockCourseData]);

      const response = await request(app).get("/courses");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.courses[0].bookingStats.totalBookings).toBe(2);
      expect(response.body.courses[0].bookingStats.totalRevenue).toBe(3000);
    });

    it("should return 500 on database error", async () => {
      mockCourse.findAll.mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/courses");

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe("GET /courses/:id", () => {
    it("should return a course by id with status 200", async () => {
      const mockCourseData = {
        toJSON: () => ({ id: "uuid-1234", name: "JS Basics", image: "/uploads/js.jpg" }),
      };
      mockCourse.findByPk.mockResolvedValue(mockCourseData);

      const response = await request(app).get("/courses/uuid-1234");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.course.name).toBe("JS Basics");
    });

    it("should return 404 if course not found", async () => {
      mockCourse.findByPk.mockResolvedValue(null);

      const response = await request(app).get("/courses/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not found");
    });

    it("should return 500 on database error", async () => {
      mockCourse.findByPk.mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/courses/uuid-1234");

      expect(response.status).toBe(500);
    });
  });

  describe("POST /courses", () => {
    it("should create a course and return 201", async () => {
      const createdCourse = { id: "uuid-new", name: "New Course" };
      mockCourse.create.mockResolvedValue(createdCourse);
      mockLecture.findAll.mockResolvedValue([]);
      mockCourse.update.mockResolvedValue([1]);
      mockCourse.findByPk.mockResolvedValue({
        ...createdCourse,
        toJSON: () => createdCourse,
      });

      const response = await request(app)
        .post("/courses")
        .send({
          name: "New Course",
          teacher: "John Doe",
          pricingType: "free",
          totalDuration: JSON.stringify({ hours: 1, minutes: 30 }),
          lectures: JSON.stringify([]),
          totalLectures: "0",
          courseType: "regular",
          overview: "A new course overview",
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it("should return 500 on creation error", async () => {
      mockCourse.create.mockRejectedValue(new Error("Validation error"));

      const response = await request(app)
        .post("/courses")
        .send({
          name: "Bad Course",
          teacher: "Error Guy",
          totalDuration: JSON.stringify({ hours: 0, minutes: 0 }),
          lectures: JSON.stringify([]),
        });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe("DELETE /courses/:id", () => {
    it("should delete a course and return success", async () => {
      const mockCourseInstance = {
        id: "uuid-1234",
        image: null,
        destroy: jest.fn().mockResolvedValue(true),
      };
      mockCourse.findByPk.mockResolvedValue(mockCourseInstance);

      const response = await request(app).delete("/courses/uuid-1234");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe("Course deleted");
    });

    it("should return 404 if course not found", async () => {
      mockCourse.findByPk.mockResolvedValue(null);

      const response = await request(app).delete("/courses/non-existent");

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Not found");
    });

    it("should return 500 on error", async () => {
      mockCourse.findByPk.mockRejectedValue(new Error("DB error"));

      const response = await request(app).delete("/courses/uuid-1234");

      expect(response.status).toBe(500);
    });
  });

  describe("POST /courses/:courseId/rate", () => {
    it("should add a rating and return 200", async () => {
      mockCourse.findByPk.mockResolvedValue({ id: "uuid-1234" });
      mockRating.findOne.mockResolvedValue(null);
      mockRating.create.mockResolvedValue({ id: "rating-1", rating: 4 });
      mockRating.findAll.mockResolvedValue([{ rating: 4 }, { rating: 5 }]);
      mockCourse.update.mockResolvedValue([1]);

      const response = await request(app)
        .post("/courses/uuid-1234/rate")
        .send({ rating: 4, comment: "Very helpful!" });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.avgRating).toBe(4.5);
      expect(response.body.totalRatings).toBe(2);
    });

    it("should return 400 if rating is out of range", async () => {
      const response = await request(app)
        .post("/courses/uuid-1234/rate")
        .send({ rating: 0 });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Rating must be between 1 and 5");
    });

    it("should return 404 if course not found", async () => {
      mockCourse.findByPk.mockResolvedValue(null);

      const response = await request(app)
        .post("/courses/non-existent/rate")
        .send({ rating: 3 });

      expect(response.status).toBe(404);
    });
  });

  describe("GET /courses/:courseId/my-rating", () => {
    it("should return the user's rating for a course", async () => {
      const myRating = {
        id: "rating-1",
        rating: 5,
        comment: "Excellent!",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRating.findOne.mockResolvedValue(myRating);

      const response = await request(app).get("/courses/uuid-1234/my-rating");

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.myRating.rating).toBe(5);
    });

    it("should return null if user has not rated the course", async () => {
      mockRating.findOne.mockResolvedValue(null);

      const response = await request(app).get("/courses/uuid-1234/my-rating");

      expect(response.status).toBe(200);
      expect(response.body.myRating).toBeNull();
    });

    it("should return 500 on database error", async () => {
      mockRating.findOne.mockRejectedValue(new Error("DB error"));

      const response = await request(app).get("/courses/uuid-1234/my-rating");

      expect(response.status).toBe(500);
    });
  });
});