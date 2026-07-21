import jwt from 'jsonwebtoken';

export const generateAccessToken = (admin) => {
  return jwt.sign(
    { id: admin._id, username: admin.username, role: admin.role },
    process.env.JWT_ACCESS_SECRET || 'fallback-access-secret-key-12345',
    { expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m' }
  );
};

export const generateRefreshToken = (admin) => {
  return jwt.sign(
    { id: admin._id },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key-12345',
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
};
