// Service → thinks & decides

import fs from "fs";
import path from "path";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import Chapter from "../models/chapterModel.js";
import Rating from "../models/ratingModel.js";
import { calculateCourseDuration } from "../hooks/courseDurationHook.js";
import { makeImageAbsolute } from "../uploads";

export const getPublicCoursesService = async ({ home, type, limit, req }) => {
  const where = {};

  if (home === "true") where.courseType = "top";
  else if (type === "top") where.courseType = "top";
  else if (type === "regular") where.courseType = "regular";

  const courses = await Course.findAll({
    where,
    order: [["createdAt", "DESC"]],
    limit: limit || undefined
  });

  return courses.map(c => ({
    ...c.toJSON(),
    image: makeImageAbsolute(c.image, req)
  }));
};

export const getAllCoursesService = async (req) => {
  const courses = await Course.findAll({ order: [["createdAt", "DESC"]] });
  return courses.map(c => ({
    ...c.toJSON(),
    image: makeImageAbsolute(c.image, req)
  }));
};

export const getCourseByIdService = async (id, req) => {
  const course = await Course.findByPk(id, {
    include: [{ model: Lecture, include: [Chapter] }]
  });

  if (!course) return null;

  const obj = course.toJSON();
  obj.image = makeImageAbsolute(obj.image, req);
  return obj;
};

export const createCourseService = async (req) => {
  const body = req.body;

  const image = req.file ? `/uploads/${req.file.filename}` : "";

  const course = await Course.create({
    name: body.name,
    teacher: body.teacher,
    image,
    pricingType: body.pricingType || "free",
    overview: body.overview || "",
    courseType: body.courseType || "regular"
  });

  await calculateCourseDuration(course.id);
  return course;
};

export const deleteCourseService = async (courseId) => {
  const course = await Course.findByPk(courseId);
  if (!course) throw new Error("Not found");

  if (course.image) {
    const filePath = path.join(process.cwd(), course.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }

  await course.destroy();
};

export const rateCourseService = async ({ userId, courseId, rating, comment }) => {
  if (rating < 1 || rating > 5) {
    throw new Error("Rating must be between 1 and 5");
  }

  const course = await Course.findByPk(courseId);
  if (!course) throw new Error("Course not found");

  const [rate] = await Rating.upsert({
    userId,
    courseId,
    rating,
    comment
  });

  const ratings = await Rating.findAll({ where: { courseId } });
  const totalRatings = ratings.length;
  const avgRating =
    totalRatings === 0
      ? 0
      : Number(
          (ratings.reduce((s, r) => s + r.rating, 0) / totalRatings).toFixed(2)
        );

  await Course.update(
    { avgRating, totalRatings },
    { where: { id: courseId } }
  );

  return { avgRating, totalRatings, myRating: { userId, rating } };
};

export const getMyRatingService = async (userId, courseId) => {
  return await Rating.findOne({ where: { userId, courseId } });
};
