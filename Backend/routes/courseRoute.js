import express from 'express';
import multer from 'multer';
import path from 'path';
import { getCourses, getCourseById, createCourse, deleteCourse, getPublicCourses, rateCourse, getMyRating } from '../services/courseService'; 

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

courseRoute.post('/', upload.single('image'), createCourse);
courseRoute.delete('/:id', deleteCourse);

courseRoute.post('/:courseId/rate', rateCourse);
courseRoute.get('/:courseId/rating', getMyRating);

export default courseRoute;
