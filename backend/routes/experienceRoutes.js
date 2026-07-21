import express from 'express';
import {
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience
} from '../controllers/experienceController.js';
import { protect } from '../middleware/auth.js';
import { experienceRules } from '../validators/rules.js';
import validate from '../validators/validate.js';

const router = express.Router();

router.get('/', getExperiences);
router.get('/:id', getExperience);

router.post('/', protect, experienceRules, validate, createExperience);
router.put('/:id', protect, experienceRules, validate, updateExperience);
router.delete('/:id', protect, deleteExperience);

export default router;
