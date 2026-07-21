import express from 'express';
import {
  getHero,
  updateHero,
  getAbout,
  updateAbout,
  getSocials,
  createSocial,
  updateSocial,
  deleteSocial,
  getDashboardStats,
  getPublicVisitorCount
} from '../controllers/settingController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// Publicly readable settings
router.get('/hero', getHero);
router.get('/about', getAbout);
router.get('/socials', getSocials);
router.get('/visitor-count', getPublicVisitorCount);

// Protected update routes
router.put('/hero', protect, updateHero);
router.put('/about', protect, upload.single('image'), updateAbout);

// Social links management
router.post('/socials', protect, createSocial);
router.put('/socials/:id', protect, updateSocial);
router.delete('/socials/:id', protect, deleteSocial);

// Dashboard analytics aggregates
router.get('/stats', protect, getDashboardStats);

export default router;
