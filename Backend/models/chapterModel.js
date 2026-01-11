// Model → stores data

import { DataTypes } from "sequelize";
import sequelize from "../database/db.js";
import Lecture from "./lectureModel.js";

const Chapter = sequelize.define(
  "Chapter",
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

    topic: {
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

    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
);

Chapter.belongsTo(Lecture, { foreignKey: "lectureId", onDelete: "CASCADE" });
Lecture.hasMany(Chapter, { foreignKey: "lectureId" });

export default Chapter;
