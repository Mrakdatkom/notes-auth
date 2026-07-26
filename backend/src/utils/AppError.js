// backend/src/utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    // 1. Call the parent constructor with the message
    super(message);

    // 2. Set the status code and mark the error as operational
    this.statusCode = statusCode;

    // 3. Differentiate between operational errors (expected, 4xx, fail) and programmer errors (unexpected, 5xx, error)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // 4. Mark error as operational (expected) so we can safely send the message to the client
    this.isOperational = true;

    // 5. Capture the stack trace to keep the constructor clean
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;