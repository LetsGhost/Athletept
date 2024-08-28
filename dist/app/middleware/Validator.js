import { check, validationResult } from 'express-validator';
import logger from '../../config/winstonLogger.js';
export const sanitizeLoginInput = [
    // Use the check function to specify the fields you want to sanitize.
    // In this example, we're sanitizing the 'email' and 'password' fields.
    check('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
    check('password').isLength({ min: Number(process.env.PASSWORD_LENGTH) }).withMessage('Password is to short'),
    // This middleware function will run after the sanitization.
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If there are validation errors, send a 400 Bad Request response with the errors.
            const errorMessages = errors.array().map(error => error.msg);
            logger.warn('Invalid login input: ' + errorMessages.join(', '), { service: 'Validator.sanitizeLoginInput' });
            return res.status(400).json({ success: false });
        }
        next();
    },
];
