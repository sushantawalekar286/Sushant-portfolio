import express from 'express';
import {
  getCertificates,
  getCertificate,
  createCertificate,
  updateCertificate,
  deleteCertificate
} from '../controllers/certificateController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../config/cloudinary.js';
import { certificateRules } from '../validators/rules.js';
import validate from '../validators/validate.js';

const router = express.Router();

router.get('/', getCertificates);
router.get('/:id', getCertificate);

router.post('/', protect, upload.single('image'), certificateRules, validate, createCertificate);
router.put('/:id', protect, upload.single('image'), certificateRules, validate, updateCertificate);
router.delete('/:id', protect, deleteCertificate);

export default router;
