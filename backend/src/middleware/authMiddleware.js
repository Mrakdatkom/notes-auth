// authMiddleware.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import AppError from '../utils/AppError.js';

export default async function authMiddleware(req, res, next) {
  try {
    // 1. Get token from cookie (cookieParser)
    const token = req.cookies?.token;

    // 2. Verify token (protect)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. attach user object to request
    const user = await User.findById(decoded.userId);

    // Check if user exist in DB
    if (!user) {
      return next(new AppError('The user belonging to this token does not exist.', 401));
    }

    req.user = user; // Attach the whole user object to the request for further use in controllers

    // 4. forward to the controller
    next();
  } catch (err) {

    // Handle JWT-specific errors before passing to errorMiddleware 
    if (err.name === 'TokenExpiredError') {
      return next(new AppError('Session expired. Please log in again.', 401));
    }

    // Handle invalid JWT errors
    if (err.name === 'JsonWebTokenError') {
      return next(new AppError('Invalid token. Please log in again.', 401));
    }

    // Any other unexpected error 
    next(err);
  }
};