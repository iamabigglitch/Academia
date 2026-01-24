import SequelizeMock from 'sequelize-mock';
import { describe, test, expect } from '@jest/globals';

// 1️⃣ Setup mock DB
const dbMock = new SequelizeMock();

// 2️⃣ Define MOCK model (structure only)
const CourseMock = dbMock.define('Course', {
  id: 'UUID',
  name: 'STRING',
  teacher: 'STRING',
  image: 'STRING',
  avgRating: 'FLOAT',
  totalRatings: 'INTEGER',
  pricingType: 'STRING',
  priceOriginal: 'FLOAT',
  priceSale: 'FLOAT',
  overview: 'TEXT',
  totalDurationHours: 'INTEGER',
  totalDurationMinutes: 'INTEGER',
  totalLectures: 'INTEGER',
  courseType: 'STRING',
});

// 3️⃣ Group tests
describe('Course Model Tests', () => {

  // ✅ Positive test
  test('should create a course with valid data', async () => {
    const course = await CourseMock.create({
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
    expect(course.pricingType).toBe("paid");
  });

  // ✅ Default values test
  test('should set default values', async () => {
    const course = await CourseMock.create({
      name: "Test Course",
      teacher: "Test Teacher",
    });

    expect(course.avgRating).toBeDefined();
    expect(course.totalRatings).toBeDefined();
    expect(course.pricingType).toBeDefined();
    expect(course.courseType).toBeDefined();
  });

  // ❌ Required field test
  test('should fail when name is missing', async () => {
    await expect(
      CourseMock.create({
        teacher: "Dr. KC",
      })
    ).rejects.toBeTruthy();
  });

});
