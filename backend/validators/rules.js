import { body } from 'express-validator';

export const loginRules = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const updateProfileRules = [
  body('username').optional().trim().notEmpty().withMessage('Username cannot be empty'),
  body('email').optional().trim().isEmail().withMessage('Must be a valid email address'),
  body('currentPassword').optional().notEmpty().withMessage('Current password is required to set a new password'),
  body('newPassword').optional().isLength({ min: 6 }).withMessage('New password must be at least 6 characters long')
];

export const contactRules = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').trim().notEmpty().withMessage('Email is required').isEmail().withMessage('Must be a valid email address'),
  body('subject').optional().trim().isLength({ max: 100 }).withMessage('Subject cannot exceed 100 characters'),
  body('message').trim().notEmpty().withMessage('Message is required').isLength({ min: 10, max: 2000 }).withMessage('Message must be between 10 and 2000 characters')
];

export const projectRules = [
  body('title').trim().notEmpty().withMessage('Project title is required'),
  body('description').trim().notEmpty().withMessage('Project description is required'),
  body('skills').custom((val) => {
    if (val === undefined || val === null) return true;
    if (typeof val === 'string') return true;
    if (Array.isArray(val)) return true;
    throw new Error('Skills must be a string or array of strings');
  }),
  body('status').optional().isIn(['Completed', 'In Progress', 'Planned']).withMessage('Status must be Completed, In Progress, or Planned')
];

export const skillRules = [
  body('name').trim().notEmpty().withMessage('Skill name is required'),
  body('category').trim().notEmpty().withMessage('Category is required').isIn([
    'Frontend',
    'Backend',
    'Database',
    'Programming Languages',
    'DevOps',
    'Cloud',
    'Tools',
    'Soft Skills'
  ]).withMessage('Invalid skill category'),
  body('proficiency').optional().isInt({ min: 0, max: 100 }).withMessage('Proficiency must be an integer between 0 and 100')
];

export const experienceRules = [
  body('company').trim().notEmpty().withMessage('Company is required'),
  body('position').trim().notEmpty().withMessage('Position/Role is required'),
  body('duration').trim().notEmpty().withMessage('Duration timeline is required')
];

export const educationRules = [
  body('institute').trim().notEmpty().withMessage('Institute is required'),
  body('degree').trim().notEmpty().withMessage('Degree is required'),
  body('duration').trim().notEmpty().withMessage('Duration timeline is required')
];

export const certificateRules = [
  body('name').trim().notEmpty().withMessage('Certificate name is required'),
  body('issuer').trim().notEmpty().withMessage('Issuer is required'),
  body('issueDate').trim().notEmpty().withMessage('Issue date is required')
];

export const achievementsRules = [
  body('title').trim().notEmpty().withMessage('Achievement title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').trim().notEmpty().withMessage('Category is required').isIn(['Award', 'Hackathon', 'Coding Profile', 'Leadership', 'Other']).withMessage('Invalid category'),
  body('date').trim().notEmpty().withMessage('Date is required')
];
