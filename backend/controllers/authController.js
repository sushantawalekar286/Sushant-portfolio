import Admin from '../models/Admin.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import { sendSuccess, sendError } from '../utils/response.js';

// Setup cookie options
const getCookieOptions = (maxAgeDays) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict', // Protect against CSRF
  maxAge: maxAgeDays * 24 * 60 * 60 * 1000
});

// Admin Login
export const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return sendError(res, 'Invalid credentials entered.', null, 401);
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return sendError(res, 'Invalid credentials entered.', null, 401);
    }

    const accessToken = generateAccessToken(admin);
    const refreshToken = generateRefreshToken(admin);

    // Save refresh token to db
    admin.refreshToken = refreshToken;
    await admin.save();

    // Set refresh token in HttpOnly cookie
    res.cookie('refreshToken', refreshToken, getCookieOptions(7));
    // Also store access token in cookie for SPA simplicity, or send via response
    res.cookie('accessToken', accessToken, getCookieOptions(0.25)); // 15 mins (0.25 day = 6 hours maxAge but token expires in 15 mins anyway)

    return sendSuccess(res, 'Logged in successfully', {
      username: admin.username,
      email: admin.email,
      role: admin.role,
      accessToken
    });
  } catch (error) {
    next(error);
  }
};

// Refresh Token
export const refresh = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return sendError(res, 'Session expired. Please log in again.', null, 401);
  }

  try {
    const admin = await Admin.findOne({ refreshToken });
    if (!admin) {
      return sendError(res, 'Invalid session token. Please log in again.', null, 401);
    }

    // Verify token
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret-key-12345', async (err, decoded) => {
      if (err) {
        admin.refreshToken = undefined;
        await admin.save();
        res.clearCookie('refreshToken');
        res.clearCookie('accessToken');
        return sendError(res, 'Session token expired or corrupted. Please log in again.', null, 401);
      }

      const newAccessToken = generateAccessToken(admin);
      const newRefreshToken = generateRefreshToken(admin);

      admin.refreshToken = newRefreshToken;
      await admin.save();

      res.cookie('refreshToken', newRefreshToken, getCookieOptions(7));
      res.cookie('accessToken', newAccessToken, getCookieOptions(0.25));

      return sendSuccess(res, 'Token refreshed successfully', {
        username: admin.username,
        email: admin.email,
        role: admin.role,
        accessToken: newAccessToken
      });
    });
  } catch (error) {
    next(error);
  }
};

// Admin Logout
export const logout = async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  try {
    if (refreshToken) {
      const admin = await Admin.findOne({ refreshToken });
      if (admin) {
        admin.refreshToken = undefined;
        await admin.save();
      }
    }

    res.clearCookie('refreshToken');
    res.clearCookie('accessToken');
    return sendSuccess(res, 'Logged out successfully');
  } catch (error) {
    next(error);
  }
};

// Get profile details
export const getProfile = async (req, res) => {
  return sendSuccess(res, 'Admin profile retrieved successfully', {
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
    role: req.user.role
  });
};

// Update profile details (username, email, passwords)
export const updateProfile = async (req, res, next) => {
  const { username, email, currentPassword, newPassword } = req.body;

  try {
    const admin = await Admin.findById(req.user._id);

    if (username) admin.username = username;
    if (email) admin.email = email;

    if (newPassword) {
      if (!currentPassword) {
        return sendError(res, 'Current password is required to change password.', null, 400);
      }
      const isMatch = await admin.comparePassword(currentPassword);
      if (!isMatch) {
        return sendError(res, 'Current password entered is incorrect.', null, 400);
      }
      admin.password = newPassword;
    }

    await admin.save();
    return sendSuccess(res, 'Profile updated successfully', {
      username: admin.username,
      email: admin.email,
      role: admin.role
    });
  } catch (error) {
    next(error);
  }
};

// Forgot Password Flow
export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) {
      // Return 200/success to prevent user enumeration attacks
      return sendSuccess(res, 'If an account exists with that email, a password reset link has been generated.');
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    admin.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    admin.resetPasswordExpire = Date.now() + 30 * 60 * 1000; // 30 minutes expiry

    await admin.save();

    // Reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/api/auth/reset-password/${resetToken}`;
    console.log(`\n=== PASSWORD RESET REQUEST ===`);
    console.log(`Email: ${email}`);
    console.log(`URL: ${resetUrl}`);
    console.log(`==============================\n`);

    // We can also log it to dashboard notifications or try sending email if configured
    return sendSuccess(res, 'Password reset link generated successfully. (Check server logs in development environment)');
  } catch (error) {
    next(error);
  }
};

// Reset Password
export const resetPassword = async (req, res, next) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    return sendError(res, 'Password is required to reset.', null, 400);
  }

  try {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!admin) {
      return sendError(res, 'Reset token is invalid or has expired.', null, 400);
    }

    admin.password = password;
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    admin.refreshToken = undefined; // Force re-login on all devices

    await admin.save();
    return sendSuccess(res, 'Password has been reset successfully. Please log in with your new password.');
  } catch (error) {
    next(error);
  }
};

// Temporary Admin Registration (will be removed after use)
export const register = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return sendError(res, 'All fields are required.', null, 400);
  }

  try {
    const existing = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existing) {
      return sendError(res, 'Admin account with this username or email already exists.', null, 400);
    }

    const admin = await Admin.create({
      username,
      email,
      password,
      role: 'superadmin'
    });

    return sendSuccess(res, 'Admin account created successfully!', {
      username: admin.username,
      email: admin.email
    });
  } catch (error) {
    next(error);
  }
};

