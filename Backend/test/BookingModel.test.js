import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

const BookingMock = dbMock.define("Booking", {
  id: 1,
  bookingId: "BK-1700000000000-1",
  userId: 1,
  studentName: "Kasha KC",
  courseId: "uuid-course-1234",
  courseName: "Introduction to JavaScript",
  teacherName: "Jenisha Regmi",
  price: 1200,
  paymentMethod: "Online",
  paymentStatus: "Paid",
  paymentIntentId: null,
  sessionId: null,
  orderStatus: "Completed",
  notes: "",
  paidAt: new Date("2024-01-15"),
});

describe("Booking Model", () => {
  it("should create a booking with valid data", async () => {
    const booking = await BookingMock.create({
      id: 1,
      bookingId: "BK-1700000000000-1",
      userId: 1,
      studentName: "Kasha KC",
      courseId: "uuid-course-1234",
      courseName: "Introduction to JavaScript",
      teacherName: "Jenisha Regmi",
      price: 1200,
      paymentMethod: "Online",
      paymentStatus: "Paid",
      paymentIntentId: null,
      sessionId: null,
      orderStatus: "Completed",
      notes: "",
      paidAt: new Date("2024-01-15"),
    });

    expect(booking.bookingId).toBe("BK-1700000000000-1");
    expect(booking.userId).toBe(1);
    expect(booking.studentName).toBe("Kasha KC");
    expect(booking.courseId).toBe("uuid-course-1234");
    expect(booking.courseName).toBe("Introduction to JavaScript");
    expect(booking.teacherName).toBe("Jenisha Regmi");
    expect(booking.price).toBe(1200);
    expect(booking.paymentMethod).toBe("Online");
    expect(booking.paymentStatus).toBe("Paid");
    expect(booking.orderStatus).toBe("Completed");
    expect(booking.notes).toBe("");
    expect(booking.paidAt).toBeDefined();
    expect(booking.paymentIntentId).toBeNull();
    expect(booking.sessionId).toBeNull();
  });
});