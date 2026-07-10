import jwt from "jsonwebtoken";
import User from "../models/User.js";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const newUser = await User.create({ name, email, password });
    const userData = newUser.getPublicProfile();

    res.status(201).json({
      message: "User successfully registered",
      userId: newUser._id,
      user: userData
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.login(email, password);

    // 3. Create a JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // 4. Send token as an httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 60,
    });

    const userData = user.getPublicProfile();

    // 5. Send response
    res.json({
      message: "Logged in successfully",
      userId: user._id,
      user: userData
    });
  } catch (error) {
    next(error);
  }
}

export async function getMe(req, res, next) {
  try {
    // authMiddleware will put userId on the req
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user: user.getPublicProfile() });
  } catch (error) {
    next(error);
  }
}

export async function logout(req, res, next) {
  try {
    res.cookie("token", "", { maxAge: 0 }); // Clear the cookie
    res.json({ message: "Logged out" });
  } catch (error) {
    next(error);
  }
}