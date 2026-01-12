import fs from "fs";
import path from "path";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";
import Chapter from "../models/chapterModel.js";
import Rating from "../models/ratingModel.js";
import { makeImageAbsolute } from "../uploads";


// HELPER FUNCTION: Calculate Course Duration

const calculateCourseDuration = async (courseId) => {
  const lectures = await Lecture.findAll({
    where: { courseId },
    include: [{ model: Chapter }],
  });

  let courseTotalMinutes = 0;

  for (const lecture of lectures) {
    let chaptersSum = 0;

    if (lecture.Chapters.length > 0) {
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


// GET /courses/public

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
  try {
    const body = req.body;

    // Handle image upload
    const image = req.file ? `/uploads/${req.file.filename}` : "";

    // Create course
    const course = await Course.create({
      name: body.name,
      teacher: body.teacher,
      image,
      pricingType: body.pricingType || "free",
      overview: body.overview || "",
      courseType: body.courseType || "regular"
    });

    // Calculate course duration
    await calculateCourseDuration(course.id);

    res.status(201).json({ success: true, course });
  } catch (err) {
    console.error("createCourse error:", err);
    res.status(500).json({ success: false, message: "Server error" });
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


// CONTROLLER: POST /courses/:courseId/rate

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

    // Create or update rating
    await Rating.upsert({
      userId,
      courseId,
      rating,
      comment
    });

    // Recalculate average rating
    const ratings = await Rating.findAll({ where: { courseId } });
    const totalRatings = ratings.length;
    const avgRating =
      totalRatings === 0
        ? 0
        : Number(
            (ratings.reduce((s, r) => s + r.rating, 0) / totalRatings).toFixed(2)
          );

    // Update course with new ratings
    await Course.update(
      { avgRating, totalRatings },
      { where: { id: courseId } }
    );

    res.json({ 
      success: true, 
      avgRating, 
      totalRatings, 
      myRating: { userId, rating } 
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

    // Fetch user's rating for this course
    const myRating = await Rating.findOne({ 
      where: { 
        userId, 
        courseId: req.params.courseId 
      } 
    });

    res.json({ success: true, myRating });
  } catch (err) {
    console.error("getMyRating error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};