import express from "express"
import {  googleCallback, login, signUp } from "../controllers/authController.js"
import passport from "passport"
import { protect } from "../Middleware/authmiddleware.js"

const router = express.Router()
router.post("/login",login)
router.post("/signup",signUp)


router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"],session: false })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false ,failureRedirect: "http://localhost:5173/login" }),
  googleCallback
);
router.get("/me", protect, (req, res) => {
  res.json({
    message: "Token valid",
    user: req.user,
  });
});
export default router