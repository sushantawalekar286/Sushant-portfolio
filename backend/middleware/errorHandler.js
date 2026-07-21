import { sendError } from '../utils/response.js';

const errorHandler = (err, req, res, next) => {
  console.error('Express Error Handler caught:', err);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  // Handle specific MongoDB or Mongoose errors
  if (err.name === 'CastError') {
    return sendError(res, `Invalid ID format: ${err.value}`, null, 400);
  }
  
  if (err.name === 'ValidationError') {
    const errorDetails = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorDetails
    });
  }

  if (err.code === 11000) {
    const duplicateKey = Object.keys(err.keyValue)[0];
    return sendError(res, `Duplicate field value entered: '${duplicateKey}'. It must be unique.`, null, 400);
  }

  if (err.name === 'JsonWebTokenError') {
    return sendError(res, 'Invalid authentication token. Please log in again.', null, 401);
  }

  if (err.name === 'TokenExpiredError') {
    return sendError(res, 'Authentication token has expired. Please refresh session.', null, 401);
  }

  return sendError(res, message, err, statusCode);
};

export default errorHandler;
