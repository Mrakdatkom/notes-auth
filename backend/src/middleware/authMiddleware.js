import jwt from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  // 1. Get token from cookie (cookieParser)
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: "Not authenticated" });
  }

  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // 2. Verify token (protect)
    req.userId = decoded.userId; // 3. attach user ID to request
    next(); // 4. forward to the controller
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}