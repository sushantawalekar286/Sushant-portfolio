import express from 'express';
import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  reorderSkills
} from '../controllers/skillController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import { skillRules } from '../validators/rules.js';
import validate from '../validators/validate.js';

const router = express.Router();

router.get('/', getSkills);
router.get('/:id', getSkill);

router.put('/reorder', protect, reorderSkills);
router.post('/', protect, upload.single('image'), skillRules, validate, createSkill);
router.put('/:id', protect, upload.single('image'), skillRules, validate, updateSkill);
router.delete('/:id', protect, deleteSkill);

export default router;
