import express from 'express';
import {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from '../controllers/achievementController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import { achievementsRules } from '../validators/rules.js';
import validate from '../validators/validate.js';

const router = express.Router();

router.get('/', getAchievements);
router.get('/:id', getAchievement);

router.post('/', protect, upload.single('image'), achievementsRules, validate, createAchievement);
router.put('/:id', protect, upload.single('image'), achievementsRules, validate, updateAchievement);
router.delete('/:id', protect, deleteAchievement);

export default router;
