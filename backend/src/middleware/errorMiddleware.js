// backend/src/middleware/errorMiddleware.js 
import { config } from '../config/index.js';
import AppError from '../utils/AppError.js';
const errorMiddleware = (err, req, res, next) => {
  // 1 Initialize default values to be overriden by error types later
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let isOperational = err.isOperational || false;

  // Handle specific error types
  // 2 Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}.`;
    isOperational = true;
  }

  // 3 Mongoose Duplicate Key Error
  if (err.code === 11000) {
    statusCode = 409;
    message = `Duplicate field value: ${JSON.stringify(err.keyValue)}.`;
    isOperational = true;
  }

  // 4 Mongoose Validation Error
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(el => el.message).join('. ');
    isOperational = true;
  }

  // 5 JWT Error
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    isOperational = true;
  }

  // 6 JWT Expired Error
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
    isOperational = true;
  }

  // 7 Syntax Error
  if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    statusCode = 401;
    message = 'Invalid token. Please log in again.';
    isOperational = true;
  }

  // 8 Operational Errors (e.g. Note not found, User not found, etc.)
  if (isOperational) {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  }

  // 9 Programmer Error (unexpected)
  console.error('PROGRAMMER ERROR', err);
  return res.status(500).json({
    success: false,
    message: config.nodeEnv === 'production' ? 'Something went wrong. Please try again later.' : err.message,
    ...(config.nodeEnv !== 'production' && { stack: err.stack }),
  });
};

export default errorMiddleware;