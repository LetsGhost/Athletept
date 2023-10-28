import express from 'express';

// Import Middlewares
import auhtController from '../controllers/AuthController';

// Import routes
const router = express.Router();

router.post('/login', auhtController.login);
router.get('/getUserFromToken', auhtController.getUserFromToken);

export default router;
