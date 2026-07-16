// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message); // Sets the native error message

    this.statusCode = statusCode;
    // Categorize status as 'fail' for 4xx errors or 'error' for 5xx errors
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    // Marks the error as operational so you can safely send details to the client
    this.isOperational = true;

    // Captures the stack trace, keeping the constructor call clean
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;