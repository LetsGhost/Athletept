// src/routes/userRoutes.ts
import express from 'express';
import { registerUserController } from '../controllers/UserController.ts';

const router = express.Router();

// Route for user registration
router.post('/register', registerUserController);

// Add more routes here as needed

export default router;
