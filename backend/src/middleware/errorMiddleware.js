// errorMiddleware.js — centralized JWT error handling (corrected version)
export default function errorMiddleware(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal server error';

  // Handle JWT errors that weren't caught in protect 
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  // Handle JWT expiration errors
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please log in again.';
  }

  // Handle Mongoose CastError (bad ObjectId format) 
  if (err.name === 'CastError') {
    statusCode = 400; message = 'Invalid ID format';
  }

  // Handle Mongoose duplicate key (unique index violated) 
  if (err.code === 11000) {
    statusCode = 409;
    message = `${Object.keys(err.keyValue)[0]} already exists`;
  }

  // Handle mangled JWT payloads that fail JSON parsing before signature check
  if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
    statusCode = 401;
    message = 'Invalid token';
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }) // Only include stack trace in development 
  });
};