// src/routes/userRoutes.ts
import express from 'express';
import { Request, Response } from 'express';
import { registerUserController } from '../controllers/UserController';
import { authenticateToken } from '../middleware/AuthenticateToken';

const router = express.Router();

// Route for user registration
router.post('/register',authenticateToken, registerUserController);
// Add more routes here as needed

export default router;
