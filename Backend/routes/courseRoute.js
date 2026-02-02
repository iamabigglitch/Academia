import express from 'express';
import multer from 'multer';
import path from 'path';
import { createCourse, deleteCourse, getCourseById, getCourses, getMyRating, getPublicCourses, rateCourse } from '../controllers/courseController.js';
import { protect } from '../Middleware/authmiddleware.js';

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads')),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `course-${unique}${ext}`);
  },
});

const upload = multer({ storage });

const courseRoute = express.Router();

courseRoute.get('/public', getPublicCourses);
courseRoute.get('/', getCourses);
courseRoute.get('/:id', getCourseById);

courseRoute.post('/:courseId/rate', protect, rateCourse);
courseRoute.get('/:courseId/my-rating', protect, getMyRating);

courseRoute.post('/', protect, upload.single('image'), createCourse);
courseRoute.delete('/:id', protect, deleteCourse);

export default courseRoute;