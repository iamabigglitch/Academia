import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";
import dotenv from "dotenv";

dotenv.config();

// Use the same fallback secret as JWT utility to keep verification consistent
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key_change_in_env";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findOne({
      where: { id: decoded.id },
      attributes: { exclude: ["password"] }
    });

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    console.log(user)
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};