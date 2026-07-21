import express from 'express';
import {
  submitMessage,
  getMessages,
  markMessageRead,
  deleteMessage
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';
import { contactLimiter } from '../middleware/rateLimiter.js';
import { contactRules } from '../validators/rules.js';
import validate from '../validators/validate.js';

const router = express.Router();

router.post('/', contactLimiter, contactRules, validate, submitMessage);
router.get('/', protect, getMessages);
router.put('/:id/read', protect, markMessageRead);
router.delete('/:id', protect, deleteMessage);

export default router;
