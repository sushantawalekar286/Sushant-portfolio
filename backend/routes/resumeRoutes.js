import express from 'express';
import {
  getResumes,
  getActiveResume,
  uploadResume,
  setActiveResume,
  deleteResume,
  downloadResume
} from '../controllers/resumeController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

router.get('/', getResumes);
router.get('/active', getActiveResume);
router.post('/:id/download', downloadResume);

router.post('/', protect, upload.single('file'), uploadResume);
router.put('/:id/active', protect, setActiveResume);
router.delete('/:id', protect, deleteResume);

export default router;
