import express from 'express';

// Import Middlewares
import auhtController from '../controllers/AuthController';

// Import routes
const router = express.Router();

router.post('/login', auhtController.login); // Is Documented
router.get('/getUserFromToken', auhtController.getUserFromToken); // Is Documented

export default router;
