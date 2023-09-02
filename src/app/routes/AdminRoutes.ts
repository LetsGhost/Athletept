import express from 'express';
import { registerUserController, getExercisePlanController } from "../controllers/AdminController";
import { authenticateToken } from '../middleware/AuthenticateToken';
import { upload } from '../../config/multerConfig';
import { authenticateRole } from '../middleware/AuthenticateRole';

const router = express.Router();

//Register user
router.post('/register', upload.single('excelFile'), registerUserController);

//Exercise plan
router.get("/getExercisePlan/:userId", getExercisePlanController )

export default router;
