import express from 'express';
import { 
  getLeadershipList, 
  createLeadership, 
  updateLeadership, 
  deleteLeadership 
} from '../controllers/leadershipController.js';
import { protect } from '../middleware/auth.js';
import { validate } from '../validators/validate.js';
import { body } from 'express-validator';

const router = express.Router();

// Validation Rules
const leadershipValidationRules = [
  body('organization').notEmpty().withMessage('Organization is required').trim(),
  body('role').notEmpty().withMessage('Role is required').trim(),
  body('duration').notEmpty().withMessage('Duration is required').trim(),
  body('description').notEmpty().withMessage('Description is required').trim()
];

// PUBLIC GET
router.get('/', getLeadershipList);

// PROTECTED MUTATORS
router.post('/', protect, leadershipValidationRules, validate, createLeadership);
router.put('/:id', protect, leadershipValidationRules, validate, updateLeadership);
router.delete('/:id', protect, deleteLeadership);

export default router;
