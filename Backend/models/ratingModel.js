import { DataTypes } from "sequelize";
import { sequelize } from "../database/db.js";
import { User } from "./userModel.js";
import Course from "./courseModel.js";

export const Rating = sequelize.define(
  "Rating",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    courseId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "Courses",
        key: "id",
      },
      onDelete: "CASCADE",
    },

    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 1,
        max: 5,
      },
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ["userId", "courseId"],
        name: "unique_user_course_rating",
      },
    ],
  }
);

Rating.belongsTo(User, { foreignKey: "userId", as: "user" });
Rating.belongsTo(Course, { foreignKey: "courseId", as: "course" });

Course.hasMany(Rating, { foreignKey: "courseId", as: "ratings" });
User.hasMany(Rating, { foreignKey: "userId", as: "ratings" });

export default Rating;