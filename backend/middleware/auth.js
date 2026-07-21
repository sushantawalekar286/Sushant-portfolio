import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { sendError } from '../utils/response.js';

export const protect = async (req, res, next) => {
  let token;

  // Read token from Authorization header or cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    return sendError(res, 'Access denied. No authorization token was provided.', null, 401);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET || 'fallback-access-secret-key-12345');
    
    // Find the admin user
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return sendError(res, 'Admin account corresponding to this token was not found.', null, 404);
    }
    
    req.user = admin;
    next();
  } catch (error) {
    console.error('JWT Verification error:', error.message);
    if (error.name === 'TokenExpiredError') {
      return sendError(res, 'Access token has expired. Please refresh session.', error, 401);
    }
    return sendError(res, 'Invalid authorization token. Please log in again.', error, 401);
  }
};

// Role authorization check (admin or superadmin)
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return sendError(
        res,
        `User role '${req.user ? req.user.role : 'none'}' is not authorized to access this resource.`,
        null,
        403
      );
    }
    next();
  };
};
