import express from 'express';
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  viewProject
} from '../controllers/projectController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import { projectRules } from '../validators/rules.js';
import validate from '../validators/validate.js';

const router = express.Router();

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/:id/view', viewProject);

router.post('/', protect, upload.array('images', 5), projectRules, validate, createProject);
router.put('/:id', protect, upload.array('images', 5), projectRules, validate, updateProject);
router.delete('/:id', protect, deleteProject);

export default router;
