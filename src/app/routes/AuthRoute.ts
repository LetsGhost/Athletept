import express from 'express';

// Import Middlewares
import authController from '../controllers/AuthController';

// Import routes
const authRouter = express.Router();

authRouter.post('/login', authController.login);

export default authRouter;
