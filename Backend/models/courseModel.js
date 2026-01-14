import { DataTypes } from "sequelize";
import {sequelize}  from "../database/db.js";


const Course = sequelize.define(
  "Course",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    teacher: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    image: {
      type: DataTypes.STRING,
    },

    avgRating: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    totalRatings: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    pricingType: {
      type: DataTypes.ENUM("free", "paid"),
      defaultValue: "free",
    },

    priceOriginal: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    priceSale: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
    },

    overview: {
      type: DataTypes.TEXT,
    },

    totalDurationHours: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    totalDurationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    totalLectures: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    courseType: {
      type: DataTypes.ENUM("regular", "top"),
      defaultValue: "regular",
    },
  },
  {
    timestamps: true,
  }
);

export default Course;
