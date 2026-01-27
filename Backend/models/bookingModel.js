import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";
import { User } from "./userModel.js";
import Course from "./courseModel.js";

export const Booking = sequelize.define("Booking", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  bookingId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Unknown",
  },
  courseId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  courseName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  teacherName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0,
  },
  paymentMethod: {
    type: DataTypes.ENUM("Online", "Cash"),
    allowNull: false,
    defaultValue: "Online",
  },
  paymentStatus: {
    type: DataTypes.ENUM("Unpaid", "Paid"),
    allowNull: false,
    defaultValue: "Unpaid",
  },
  paymentIntentId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: null,
  },
  orderStatus: {
    type: DataTypes.ENUM("Pending", "Confirmed", "Cancelled", "Completed", "Failed"),
    allowNull: false,
    defaultValue: "Pending",
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: false,
    defaultValue: "",
  },
  paidAt: {
    type: DataTypes.DATE,
    allowNull: true,
  }
}, {
  timestamps: true,
  tableName: "Bookings",
});

// Relationships
Booking.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Booking, { foreignKey: 'userId' });

Booking.belongsTo(Course, { foreignKey: 'courseId', as: 'course' });
Course.hasMany(Booking, { foreignKey: 'courseId' });