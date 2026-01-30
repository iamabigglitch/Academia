import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Ensure we always have a JWT secret to prevent token generation failures
const JWT_SECRET = process.env.JWT_SECRET || "default_jwt_secret_key_change_in_env";

export const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const VerifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
};

export const generateResetToken = (email) => {
  return jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });
};