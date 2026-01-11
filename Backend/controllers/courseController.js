import { createCourseService, getPublicCoursesService, getAllCoursesService, getCourseByIdService, deleteCourseService, rateCourseService, getMyRatingService } from "../services/courseService.js";


  //GET /courses/public
 
export const getPublicCourses = async (req, res) => {
  try {
    const { home, type = "all", limit } = req.query;

    const courses = await getPublicCoursesService({
      home,
      type,
      limit: Number(limit),
      req
    });

    res.json({ success: true, items: courses });
  } catch (err) {
    console.error("getPublicCourses error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//GET /courses
 
export const getCourses = async (req, res) => {
  try {
    const courses = await getAllCoursesService(req);
    res.json({ success: true, courses });
  } catch (err) {
    console.error("getCourses error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

 //GET /courses/:id

export const getCourseById = async (req, res) => {
  try {
    const course = await getCourseByIdService(req.params.id, req);
    if (!course) {
      return res.status(404).json({ success: false, message: "Not found" });
    }

    res.json({ success: true, course });
  } catch (err) {
    console.error("getCourseById error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /courses
 
export const createCourse = async (req, res) => {
  try {
    const course = await createCourseService(req);
    res.status(201).json({ success: true, course });
  } catch (err) {
    console.error("createCourse error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// DELETE /courses/:id
 
export const deleteCourse = async (req, res) => {
  try {
    await deleteCourseService(req.params.id);
    res.json({ success: true, message: "Course deleted" });
  } catch (err) {
    console.error("deleteCourse error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//POST /courses/:courseId/rate

export const rateCourse = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const result = await rateCourseService({
      userId,
      courseId: req.params.courseId,
      rating: req.body.rating,
      comment: req.body.comment || ""
    });

    res.json({ success: true, ...result });
  } catch (err) {
    console.error("rateCourse error:", err);
    res.status(500).json({ success: false, message: err.message || "Server error" });
  }
};

//GET /courses/:courseId/my-rating
 
export const getMyRating = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const myRating = await getMyRatingService(userId, req.params.courseId);
    res.json({ success: true, myRating });
  } catch (err) {
    console.error("getMyRating error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
