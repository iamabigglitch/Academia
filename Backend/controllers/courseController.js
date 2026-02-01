import fs from "fs";
import path from "path";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import Chapter from "../models/chapterModel.js";

import { makeImageAbsolute } from "../uploads/academiauploads.js";
import { ratingModel } from "../models/ratingModel.js";

const calculateCourseDuration = async (courseId) => {
  const lectures = await Lecture.findAll({
    where: { courseId },
    include: [{ model: Chapter }],
  });

  let courseTotalMinutes = 0;

  for (const lecture of lectures) {
    let chaptersSum = 0;

    if (lecture.Chapters && lecture.Chapters.length > 0) {
      for (const chapter of lecture.Chapters) {
        const h = Number(chapter.durationHours) || 0;
        const m = Number(chapter.durationMinutes) || 0;
        const total = Math.max(0, h * 60 + m);

        chapter.totalMinutes = total;
        await chapter.save();

        chaptersSum += total;
      }

      lecture.totalMinutes = chaptersSum;
    } else {
      const h = Number(lecture.durationHours) || 0;
      const m = Number(lecture.durationMinutes) || 0;
      lecture.totalMinutes = Math.max(0, h * 60 + m);
    }

    lecture.durationHours = Math.floor(lecture.totalMinutes / 60);
    lecture.durationMinutes = lecture.totalMinutes % 60;
    
    await lecture.save();
    courseTotalMinutes += lecture.totalMinutes;
  }

  await Course.update(
    {
      totalDurationHours: Math.floor(courseTotalMinutes / 60),
      totalDurationMinutes: courseTotalMinutes % 60,
      totalLectures: lectures.length,
    },
    { where: { id: courseId } }
  );

};

export const getPublicCourses = async (req, res) => {
  try {
    const { home, type = "all", limit } = req.query;

    // Build where clause
    const where = {};
    if (home === "true") where.courseType = "top";
    else if (type === "top") where.courseType = "top";
    else if (type === "regular") where.courseType = "regular";

    // Fetch courses
    const courses = await Course.findAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: limit ? Number(limit) : undefined
    });

    // Map courses with absolute image URLs
    const items = courses.map(c => ({
      ...c.toJSON(),
      image: makeImageAbsolute(c.image, req)
    }));

    res.json({ success: true, items });
  } catch (err) {
    console.error("getPublicCourses error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /courses
export const getCourses = async (req, res) => {
  try {
    // Fetch all courses
    const courses = await Course.findAll({ 
      order: [["createdAt", "DESC"]] 
    });

    // Map courses with absolute image URLs
    const coursesWithImages = courses.map(c => ({
      ...c.toJSON(),
      image: makeImageAbsolute(c.image, req)
    }));

    res.json({ success: true, courses: coursesWithImages });
  } catch (err) {
    console.error("getCourses error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /courses/:id
export const getCourseById = async (req, res) => {
  try {
    // Fetch course with lectures and chapters
    const course = await Course.findByPk(req.params.id, {
      include: [{ model: Lecture, include: [Chapter] }]
    });

    if (!course) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // Convert to JSON and add absolute image URL
    const courseData = course.toJSON();
    courseData.image = makeImageAbsolute(courseData.image, req);

    res.json({ success: true, course: courseData });
  } catch (err) {
    console.error("getCourseById error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /courses
export const createCourse = async (req, res) => {
  console.log("create course api hitting");

  try {
    const body = req.body;
    console.log("RAW BODY:", body);

    // Parse JSON fields (IMPORTANT)
    const price = body.price ? JSON.parse(body.price) : null;
    const totalDuration = JSON.parse(body.totalDuration);
    // Image
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    const pricingType = body.pricingType || "free";

    let priceOriginal = 0;
    let priceSale = 0;

    if (pricingType === "paid" && price) {
      priceOriginal = Number(price.original) || 0;
      priceSale = Number(price.sale) || 0;
    }

    const course = await Course.create({
      name: body.name,
      teacher: body.teacher,
      pricingType,
      priceOriginal,
      priceSale,
      overview: body.overview || "",
      courseType: body.courseType || "regular",
      totalDurationHours: totalDuration.hours || 0,
      totalDurationMinutes: totalDuration.minutes || 0,
      totalLectures: Number(body.totalLectures) || 0,
      image,
    });

    await calculateCourseDuration(course.id);

    res.status(201).json({ success: true, course });
  } catch (err) {
    console.error("createCourse error:", err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// DELETE /courses/:id
export const deleteCourse = async (req, res) => {
  try {
    // Find course
    const course = await Course.findByPk(req.params.id);
    
    if (!course) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    // Delete image file if exists
    if (course.image) {
      const filePath = path.join(process.cwd(), course.image);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    // Delete course
    await course.destroy();

    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    console.error("deleteCourse error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /courses/:courseId/rate
export const rateCourse = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { rating, comment = "" } = req.body;
    const courseId = req.params.courseId;

    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: "Rating must be between 1 and 5" 
      });
    }

    // Check if course exists
    const course = await Course.findByPk(courseId);
    if (!course) {
      return res.status(404).json({ 
        success: false, 
        message: "Course not found" 
      });
    }

    // For now, just return success (ratings will be implemented later)
    res.json({ 
      success: true, 
      avgRating: 4.5, 
      totalRatings: 10, 
      myRating: { userId, rating },
      message: "Rating feature coming soon!"
    });
  } catch (err) {
    console.error("rateCourse error:", err);
    res.status(500).json({ 
      success: false, 
      message: err.message || "Server error" 
    });
  }
};

// GET /courses/:courseId/my-rating
export const getMyRating = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // For now, return null (ratings will be implemented later)
    res.json({ success: true, myRating: null });
  } catch (err) {
    console.error("getMyRating error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

