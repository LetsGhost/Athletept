// src/routes/userRoutes.ts
import express from 'express';
import { registerUserController } from "../controllers/UserController";
import { authenticateToken } from '../middleware/AuthenticateToken';
import { upload } from '../../config/multerConfig';

const router = express.Router();

// Route for user registration
router.post('/register', upload.single('excelFile'), registerUserController);
// Add more routes here as needed

export default router;
