import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  // 1. Get token from cookie
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  // 2. Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // attach user ID to request
    next(); // forward to the controller
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}