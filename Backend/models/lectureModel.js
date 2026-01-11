import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";
import Course from "./courseModel.js";

const Lecture = sequelize.define(
  "Lecture",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    durationHours: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    durationMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },

    totalMinutes: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    timestamps: false,
  }
);

Lecture.belongsTo(Course, { foreignKey: "courseId", onDelete: "CASCADE" });
Course.hasMany(Lecture, { foreignKey: "courseId" });

export default Lecture;
