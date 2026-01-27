import { User } from "../models/userModel.js";
import { generateToken } from "../Utills/jwt.js";
import bcrypt from "bcryptjs";

const validatePassword = (password) => {
  const errors = [];
  if (password.length < 6)
    errors.push("Password must be at least 6 characters");
  if (!/[0-9]/.test(password)) errors.push("Must contain number");
  return errors;
};

const signin = async (req, res) => {
  console.log("signin api hit");
  try {
    const { username, password } = req.body;
    
    if (!username) {
      return res.status(400).json({ success: false, message: "Username is required" });
    }
    if (!password) {
      return res.status(400).json({ success: false, message: "Password is required" });
    }

    const user = await User.findOne({
      where: { username }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role
    };

    const token = generateToken(user);

    res.status(200).json({
      success: true,
      token,
      user: userData,
      message: "Logged in successfully"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Server error: " + e.message });
  }
};

const signUp = async (req, res) => {
  console.log("signup api hit");
  try {
    const { email, password, username, number,role } = req.body;
    
    if (!email || !password || !username || !number) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const userExists = await User.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const usernameExists = await User.findOne({ where: { username } });
    if (usernameExists) {
      return res.status(400).json({ success: false, message: "Username already taken" });
    }

    const passwordErrors = validatePassword(password);
    if (passwordErrors.length > 0) {
      return res.status(400).json({ success: false, message: passwordErrors.join(", ") });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      number,
      role
    });

    const userData = {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role
    };

    const token = generateToken(newUser);

    res.status(201).json({
      success: true,
      token,
      user: userData,
      message: "Account created successfully"
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Server error: " + e.message });
  }
};

export { signin, signUp };