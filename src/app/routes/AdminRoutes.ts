import express from 'express';
import { registerUserController } from "../controllers/AdminController";
import { authenticateToken } from '../middleware/AuthenticateToken';
import { upload } from '../../config/multerConfig';
import { authenticateRole } from '../middleware/AuthenticateRole';

const router = express.Router();

router.post('/register', upload.single('excelFile'), registerUserController);

export default router;
