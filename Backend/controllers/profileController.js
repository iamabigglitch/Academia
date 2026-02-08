import { User } from "../models/userModel.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching profile",
      error: error.message,
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { username, email, number } = req.body;
    const userId = req.user.id;

    // Find user
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Validation errors object
    const errors = {};

    // Check if username is already taken by another user
    if (username && username !== user.username) {
      const existingUser = await User.findOne({
        where: { username: username },
      });
      if (existingUser && existingUser.id !== userId) {
        errors.username = "Username is already taken";
      }
    }

    // Check if email is already taken by another user
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({
        where: { email: email },
      });
      if (existingEmail && existingEmail.id !== userId) {
        errors.email = "Email is already in use";
      }
    }

    // If there are validation errors, return them
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    // Update fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (number !== undefined) user.number = number;

    // Handle profile image upload
    if (req.file) {
      // Delete old profile image if it exists
      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "..", user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      // Save new image path as relative path (normalize slashes)
      const relativePath = path.relative(path.join(__dirname, ".."), req.file.path).replace(/\\/g, "/");
      user.profileImage = relativePath;
    }

    await user.save();

    // Return updated user without password
    const updatedUser = await User.findByPk(userId, {
      attributes: { exclude: ["password"] },
    });

    // Ensure role is included in response
    const responseData = updatedUser.dataValues ? { ...updatedUser.dataValues } : updatedUser.toJSON();
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating profile",
      error: error.message,
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Delete profile image if exists
    if (user.profileImage) {
      const imagePath = path.join(__dirname, "..", user.profileImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await user.destroy();

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Delete account error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting account",
      error: error.message,
    });
  }
};