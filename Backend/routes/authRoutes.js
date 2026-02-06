import express from "express";
import multer from "multer";
import path from "path";
import { signin, signUp, forgotPassword, changePassword } from "../controllers/authController.js";
import { getProfile, updateProfile, deleteAccount } from "../controllers/profileController.js";
import { protect } from "../Middleware/authmiddleware.js"; 

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(process.cwd(), 'uploads', 'profiles')),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `profile-${unique}${ext}`);
  },
});

const upload = multer({ storage });

const router = express.Router();

// Authentication routes
router.post("/signin", signin);
router.post("/signup", signUp);

router.post("/forgot-password", forgotPassword);

router.put("/change-password", protect, changePassword);

router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("profileImage"), updateProfile);
router.delete("/profile", protect, deleteAccount);

export default router;