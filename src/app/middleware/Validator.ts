import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import logger from '../../config/winstonLogger.js';

export const sanitizeLoginInput = [
  // Use the check function to specify the fields you want to sanitize.
  // In this example, we're sanitizing the 'email' and 'password' fields.
  check('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  check('password').isLength({ min: 5 }).withMessage('Password must be at least 5 characters long'),

  // This middleware function will run after the sanitization.
  (req: Request, res: Response, next: Function) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // If there are validation errors, send a 400 Bad Request response with the errors.
      logger.warn('Invalid login input: ' + errors.array, {service: 'Validator.sanitizeLoginInput'});
      return res.status(400).json({ success: false });
    }
    next();
  },
];