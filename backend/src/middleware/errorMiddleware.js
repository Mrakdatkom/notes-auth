// middleware/errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
  // Log the error so you can see it in the console
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);

  // Get the status code (use 500 if none was set)
  const statusCode = err.statusCode || 500;

  // Get the error message (use generic message if none)
  const message = err.message || 'Something went wrong on the server';

  // Send response to the client
  res.status(statusCode).json({
    success: false,
    message: message,
    // Only show error details in development (not in production)
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

export default errorMiddleware;