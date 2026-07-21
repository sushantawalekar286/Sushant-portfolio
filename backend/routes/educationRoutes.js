import express from 'express';
import {
  getEducations,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation
} from '../controllers/educationController.js';
import { protect } from '../middleware/auth.js';
import { educationRules } from '../validators/rules.js';
import validate from '../validators/validate.js';

const router = express.Router();

router.get('/', getEducations);
router.get('/:id', getEducation);

router.post('/', protect, educationRules, validate, createEducation);
router.put('/:id', protect, educationRules, validate, updateEducation);
router.delete('/:id', protect, deleteEducation);

export default router;
