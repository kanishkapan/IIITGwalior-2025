import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
// Generate JWT Token & Set Cookie
const generateToken = (res, user) => {
  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
  res.cookie("jwt", token, { httpOnly: true });
};

// User Signup
export const signup = async (req, res) => {
  console.log("Signup Controller Hit!");
  console.log("Request Body:", req.body);
  try {
    const { name, email, password, role, phone, dateOfBirth, gender, specialization } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      dateOfBirth,
      gender,
      specialization: role === "doctor" ? specialization : undefined, // Only for doctors
    });

    generateToken(res, user);
    res.status(201).json({ message: "Signup successful", user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    generateToken(res, user);
    res.json({ message: "Login successful", role: user.role });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// User Logout
export const logout = (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out successfully" });
};
