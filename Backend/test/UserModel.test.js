import SequelizeMock from "sequelize-mock";

const dbMock = new SequelizeMock();

const UserMock = dbMock.define("User", {
  id: 1,
  username: "kasha_kc",
  email: "kasha@academia.com",
  role: "student",
  password: "$2b$10$hashedpasswordstring",
  number: "9800000000",
  profileImage: "/uploads/profiles/profile-123.jpg",
  resetToken: null,
  resetTokenExpiry: null,
});

describe("User Model", () => {
  it("should create a user with valid data", async () => {
    const user = await UserMock.create({
      id: 1,
      username: "kasha_kc",
      email: "kasha@academia.com",
      role: "student",
      password: "$2b$10$hashedpasswordstring",
      number: "9800000000",
      profileImage: "/uploads/profiles/profile-123.jpg",
      resetToken: null,
      resetTokenExpiry: null,
    });

    expect(user.username).toBe("kasha_kc");
    expect(user.email).toBe("kasha@academia.com");
    expect(user.role).toBe("student");
    expect(user.password).toBeDefined();
    expect(user.number).toBe("9800000000");
    expect(user.profileImage).toBe("/uploads/profiles/profile-123.jpg");
    expect(user.resetToken).toBeNull();
    expect(user.resetTokenExpiry).toBeNull();
  });
});