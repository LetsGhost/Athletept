import express from 'express';

// Import Middlewares
import auhtController from '../controllers/AuthController.js';
import { sanitizeLoginInput } from '../middleware/Validator.js';

// Import routes
const router = express.Router();

router.post('/login',sanitizeLoginInput, auhtController.login); // Is Documented
router.get('/getUserFromToken', auhtController.getUserFromToken); // Is Documented

export default router;
