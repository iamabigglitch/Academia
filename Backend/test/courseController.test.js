import { jest } from "@jest/globals";

// Mock Course model
const mockCourse = {
  create: jest.fn(),
  findAll: jest.fn(),
  findByPk: jest.fn(),
  update: jest.fn(),
};

// Mock Lecture model
const mockLecture = {
  create: jest.fn(),
  findAll: jest.fn(),
};

// Mock Chapter model
const mockChapter = {
  create: jest.fn(),
};

// Mock Rating model
const mockRating = {
  create: jest.fn(),
  findOne: jest.fn(),
  findAll: jest.fn(),
};

// Mock Booking model
const mockBooking = {};

// Mock file system
jest.unstable_mockModule("fs", () => ({
  default: {
    existsSync: jest.fn().mockReturnValue(false),
    unlinkSync: jest.fn(),
  },
}));

// Mock makeImageAbsolute utility
jest.unstable_mockModule("../uploads/academiauploads.js", () => ({
  makeImageAbsolute: jest.fn((image) => `http://localhost:5000${image}`),
}));

// Mock models
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

const {
  getPublicCourses,
  getCourses,
  getCourseById,
  createCourse,
  deleteCourse,
  rateCourse,
  getMyRating,
} = await import("../controllers/courseController.js");

describe("Course Controller", () => {
  
  const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.send = jest.fn().mockReturnValue(res);
    return res;
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getPublicCourses", () => {
    it("should return all public courses with status 200", async () => {
      const req = { query: {}, headers: { host: "localhost:5000" } };
      const res = mockResponse();

      const mockCourses = [
        { toJSON: () => ({ id: "1", name: "JS Basics", image: "/uploads/js.jpg", courseType: "regular" }) },
        { toJSON: () => ({ id: "2", name: "React Pro", image: "/uploads/react.jpg", courseType: "top" }) },
      ];
      mockCourse.findAll.mockResolvedValue(mockCourses);

      await getPublicCourses(req, res);

      expect(mockCourse.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should filter courses by type 'top'", async () => {
      const req = { query: { type: "top" }, headers: { host: "localhost:5000" } };
      const res = mockResponse();

      mockCourse.findAll.mockResolvedValue([]);

      await getPublicCourses(req, res);

      expect(mockCourse.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { courseType: "top" },
        })
      );
    });

    it("should filter courses by type 'regular'", async () => {
      const req = { query: { type: "regular" }, headers: { host: "localhost:5000" } };
      const res = mockResponse();

      mockCourse.findAll.mockResolvedValue([]);

      await getPublicCourses(req, res);

      expect(mockCourse.findAll).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { courseType: "regular" },
        })
      );
    });

    it("should return 500 on database error", async () => {
      const req = { query: {}, headers: { host: "localhost:5000" } };
      const res = mockResponse();

      mockCourse.findAll.mockRejectedValue(new Error("DB error"));

      await getPublicCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Server error" });
    });
  });

  describe("getCourses", () => {
    it("should return all courses with booking stats", async () => {
      const req = { headers: { host: "localhost:5000" } };
      const res = mockResponse();

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

      await getCourses(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          courses: expect.arrayContaining([
            expect.objectContaining({
              bookingStats: expect.objectContaining({
                totalBookings: 2,
                totalRevenue: 3000,
              }),
            }),
          ]),
        })
      );
    });

    it("should return 500 on error", async () => {
      const req = { headers: { host: "localhost:5000" } };
      const res = mockResponse();

      mockCourse.findAll.mockRejectedValue(new Error("DB error"));

      await getCourses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("getCourseById", () => {
    it("should return a course by id with status 200", async () => {
      const req = { params: { id: "uuid-1234" }, headers: { host: "localhost:5000" } };
      const res = mockResponse();

      const mockCourseData = {
        toJSON: () => ({ id: "uuid-1234", name: "JS Basics", image: "/uploads/js.jpg" }),
      };
      mockCourse.findByPk.mockResolvedValue(mockCourseData);

      await getCourseById(req, res);

      expect(mockCourse.findByPk).toHaveBeenCalledWith("uuid-1234", expect.any(Object));
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should return 404 if course not found", async () => {
      const req = { params: { id: "non-existent-id" }, headers: { host: "localhost:5000" } };
      const res = mockResponse();

      mockCourse.findByPk.mockResolvedValue(null);

      await getCourseById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Not found" });
    });

    it("should return 500 on error", async () => {
      const req = { params: { id: "uuid-1234" }, headers: { host: "localhost:5000" } };
      const res = mockResponse();

      mockCourse.findByPk.mockRejectedValue(new Error("DB error"));

      await getCourseById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("createCourse", () => {
    it("should create a free course and return 201", async () => {
      const req = {
        body: {
          name: "JS Basics",
          teacher: "John Doe",
          pricingType: "free",
          price: null,
          totalDuration: JSON.stringify({ hours: 2, minutes: 30 }),
          lectures: JSON.stringify([]),
          totalLectures: "0",
          courseType: "regular",
          overview: "Learn JS",
        },
        file: null,
        headers: { host: "localhost:5000" },
      };
      const res = mockResponse();

      const createdCourse = { id: "uuid-new", name: "JS Basics" };
      mockCourse.create.mockResolvedValue(createdCourse);
      mockLecture.findAll.mockResolvedValue([]);
      mockCourse.update.mockResolvedValue([1]);
      mockCourse.findByPk.mockResolvedValue({
        ...createdCourse,
        toJSON: () => createdCourse,
      });

      await createCourse(req, res);

      expect(mockCourse.create).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "JS Basics",
          teacher: "John Doe",
          pricingType: "free",
          priceOriginal: 0,
          priceSale: 0,
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it("should create a paid course with correct pricing", async () => {
      const req = {
        body: {
          name: "React Pro",
          teacher: "Jane Smith",
          pricingType: "paid",
          price: JSON.stringify({ original: 5000, sale: 3500 }),
          totalDuration: JSON.stringify({ hours: 10, minutes: 0 }),
          lectures: JSON.stringify([]),
          totalLectures: "0",
          courseType: "top",
          overview: "Advanced React",
        },
        file: { filename: "react-course.jpg" },
        headers: { host: "localhost:5000" },
      };
      const res = mockResponse();

      const createdCourse = { id: "uuid-paid", name: "React Pro" };
      mockCourse.create.mockResolvedValue(createdCourse);
      mockLecture.findAll.mockResolvedValue([]);
      mockCourse.update.mockResolvedValue([1]);
      mockCourse.findByPk.mockResolvedValue({
        ...createdCourse,
        toJSON: () => createdCourse,
      });

      await createCourse(req, res);

      expect(mockCourse.create).toHaveBeenCalledWith(
        expect.objectContaining({
          pricingType: "paid",
          priceOriginal: 5000,
          priceSale: 3500,
          image: "/uploads/react-course.jpg",
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
    });

    it("should return 500 on error", async () => {
      const req = {
        body: {
          name: "Bad Course",
          teacher: "Error Guy",
          totalDuration: JSON.stringify({ hours: 0, minutes: 0 }),
          lectures: JSON.stringify([]),
        },
        file: null,
      };
      const res = mockResponse();

      mockCourse.create.mockRejectedValue(new Error("DB error"));

      await createCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("deleteCourse", () => {
    it("should delete a course and return success", async () => {
      const req = { params: { id: "uuid-1234" } };
      const res = mockResponse();

      const mockCourseInstance = {
        id: "uuid-1234",
        image: null,
        destroy: jest.fn().mockResolvedValue(true),
      };
      mockCourse.findByPk.mockResolvedValue(mockCourseInstance);

      await deleteCourse(req, res);

      expect(mockCourseInstance.destroy).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith({ success: true, message: "Course deleted" });
    });

    it("should return 404 if course not found", async () => {
      const req = { params: { id: "non-existent" } };
      const res = mockResponse();

      mockCourse.findByPk.mockResolvedValue(null);

      await deleteCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Not found" });
    });

    it("should return 500 on error", async () => {
      const req = { params: { id: "uuid-1234" } };
      const res = mockResponse();

      mockCourse.findByPk.mockRejectedValue(new Error("DB error"));

      await deleteCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe("rateCourse", () => {
    it("should add a new rating successfully", async () => {
      const req = {
        user: { id: "user-1" },
        params: { courseId: "uuid-1234" },
        body: { rating: 4, comment: "Great course!" },
      };
      const res = mockResponse();

      mockCourse.findByPk.mockResolvedValue({ id: "uuid-1234" });
      mockRating.findOne.mockResolvedValue(null);
      mockRating.create.mockResolvedValue({ id: "rating-1", rating: 4, comment: "Great course!" });
      mockRating.findAll.mockResolvedValue([{ rating: 4 }, { rating: 5 }]);
      mockCourse.update.mockResolvedValue([1]);

      await rateCourse(req, res);

      expect(mockRating.create).toHaveBeenCalledWith(
        expect.objectContaining({ userId: "user-1", courseId: "uuid-1234", rating: 4 })
      );
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          avgRating: 4.5,
          totalRatings: 2,
        })
      );
    });

    it("should update an existing rating", async () => {
      const req = {
        user: { id: "user-1" },
        params: { courseId: "uuid-1234" },
        body: { rating: 5, comment: "Updated: Excellent!" },
      };
      const res = mockResponse();

      const existingRating = {
        rating: 3,
        comment: "Good",
        save: jest.fn().mockResolvedValue(true),
      };

      mockCourse.findByPk.mockResolvedValue({ id: "uuid-1234" });
      mockRating.findOne.mockResolvedValue(existingRating);
      mockRating.findAll.mockResolvedValue([{ rating: 5 }]);
      mockCourse.update.mockResolvedValue([1]);

      await rateCourse(req, res);

      expect(existingRating.rating).toBe(5);
      expect(existingRating.save).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: "Rating updated successfully",
        })
      );
    });

    it("should return 400 if rating is out of range", async () => {
      const req = {
        user: { id: "user-1" },
        params: { courseId: "uuid-1234" },
        body: { rating: 6 },
      };
      const res = mockResponse();

      await rateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      const req = {
        user: null,
        params: { courseId: "uuid-1234" },
        body: { rating: 4 },
      };
      const res = mockResponse();

      await rateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Unauthorized" });
    });

    it("should return 404 if course not found", async () => {
      const req = {
        user: { id: "user-1" },
        params: { courseId: "non-existent" },
        body: { rating: 4 },
      };
      const res = mockResponse();

      mockCourse.findByPk.mockResolvedValue(null);

      await rateCourse(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe("getMyRating", () => {
    it("should return the user's rating for a course", async () => {
      const req = {
        user: { id: "user-1" },
        params: { courseId: "uuid-1234" },
      };
      const res = mockResponse();

      const myRating = {
        id: "rating-1",
        rating: 4,
        comment: "Great!",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockRating.findOne.mockResolvedValue(myRating);

      await getMyRating(req, res);

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          myRating: expect.objectContaining({ rating: 4, comment: "Great!" }),
        })
      );
    });

    it("should return null if user has not rated the course", async () => {
      const req = {
        user: { id: "user-1" },
        params: { courseId: "uuid-1234" },
      };
      const res = mockResponse();

      mockRating.findOne.mockResolvedValue(null);

      await getMyRating(req, res);

      expect(res.json).toHaveBeenCalledWith({ success: true, myRating: null });
    });

    it("should return 401 if user is not authenticated", async () => {
      const req = {
        user: null,
        params: { courseId: "uuid-1234" },
      };
      const res = mockResponse();

      await getMyRating(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ success: false, message: "Unauthorized" });
    });

    it("should return 500 on error", async () => {
      const req = {
        user: { id: "user-1" },
        params: { courseId: "uuid-1234" },
      };
      const res = mockResponse();

      mockRating.findOne.mockRejectedValue(new Error("DB error"));

      await getMyRating(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});