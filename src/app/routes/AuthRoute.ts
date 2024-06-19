import express from 'express';

// Import Middlewares
import auhtController from '../controllers/AuthController.js';

// Import Rate Limiter
import rateLimiter from '../middleware/Limiter.js';

// Import routes
const router = express.Router();

router.post('/login',rateLimiter ,auhtController.login); // Is Documented

export default router;
