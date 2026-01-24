import { DataTypes } from "sequelize";
import {sequelize} from "../database/db.js"; 

const Booking = sequelize.define("Booking", {
  bookingId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  clerkUserId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  studentName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Unknown",
  },
  course: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  courseName: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "",
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  paymentMethod: {
    type: DataTypes.ENUM("Online"),
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
}, {
  timestamps: true, 
  tableName: "Bookings",
  indexes: [
    { fields: ["bookingId"], unique: true },
    { fields: ["clerkUserId"] },
  ],
});

export default Booking;
