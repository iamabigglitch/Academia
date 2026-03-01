import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

const CourseMock = dbMock.define("Course", {
  id: "uuid-1234",
  name: "Social History",
  teacher: "Dr. Kasha KC",
  image: "assets/images/course/react.jpg",
  avgRating: 4.5,
  totalRatings: 1200,
  pricingType: "paid",
  priceOriginal: 2000,
  priceSale: 1200,
  overview: "This course provides an in-depth understanding of social history.",
  totalDurationHours: 15,
  totalDurationMinutes: 30,
  totalLectures: 45,
  courseType: "regular",
});

describe("Course Model", () => {
  it("should create a course with valid data", async () => {
    const course = await CourseMock.create({
      id: "uuid-1234",
      name: "Social History",
      teacher: "Dr. Kasha KC",
      image: "assets/images/course/react.jpg",
      avgRating: 4.5,
      totalRatings: 1200,
      pricingType: "paid",
      priceOriginal: 2000,
      priceSale: 1200,
      overview: "This course provides an in-depth understanding of social history.",
      totalDurationHours: 15,
      totalDurationMinutes: 30,
      totalLectures: 45,
      courseType: "regular",
    });

    expect(course.name).toBe("Social History");
    expect(course.teacher).toBe("Dr. Kasha KC");
    expect(course.image).toBe("assets/images/course/react.jpg");
    expect(course.pricingType).toBe("paid");
    expect(course.priceOriginal).toBe(2000);
    expect(course.priceSale).toBe(1200);
    expect(course.priceSale).toBeLessThan(course.priceOriginal);
    expect(course.overview).toBe("This course provides an in-depth understanding of social history.");
    expect(course.avgRating).toBe(4.5);
    expect(course.avgRating).toBeGreaterThanOrEqual(0);
    expect(course.avgRating).toBeLessThanOrEqual(5);
    expect(course.totalRatings).toBe(1200);
    expect(course.totalDurationHours).toBe(15);
    expect(course.totalDurationMinutes).toBe(30);
    expect(course.totalDurationMinutes).toBeLessThan(60);
    expect(course.totalLectures).toBe(45);
    expect(course.courseType).toBe("regular");
  });
});