import express from 'express';
import {
  login,
  refresh,
  logout,
  getProfile,
  updateProfile,
  forgotPassword,
  resetPassword,
  register
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { loginLimiter } from '../middleware/rateLimiter.js';
import { loginRules, updateProfileRules } from '../validators/rules.js';
import validate from '../validators/validate.js';

const router = express.Router();

router.post('/login', loginLimiter, loginRules, validate, login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.post('/register', register);


router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfileRules, validate, updateProfile);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

export default router;
