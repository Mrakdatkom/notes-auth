import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function register(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already in use." });

    // 2. Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Create the user and save
    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "User successfully registered", userId: newUser._id });
  } catch (error) {
    console.error("Registration error", error)
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    // 1. Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 2. Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // 3. Create a JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // 4. Send token as an httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });

    // 5. Send response
    res.json({ message: "Logged in successfully", userId: user._id });
  } catch (error) {
    console.error("Login error", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getMe(req, res) {
  // authMiddleware will put userId on the req
  const user = await User.findById(req.userId).select("-password");
  res.json({ user });
}

export async function logout(req, res) {
  res.cookie("token", "", { maxAge: 0 }); // Clear the cookie
  res.json({ message: "Logged out" });
}