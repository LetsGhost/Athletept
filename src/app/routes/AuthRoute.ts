import express from 'express';

// Import Middlewares
import auhtController from '../controllers/AuthController';

import limiter from '../middleware/Limiter';

// Import routes
const router = express.Router();

// Activate for production
router.use(limiter);

router.post('/login', auhtController.login); // Is Documented
router.get('/getUserFromToken', auhtController.getUserFromToken); // Is Documented

export default router;
