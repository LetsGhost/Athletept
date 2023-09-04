// src/routes/userRoutes.ts
import express from 'express';
import { authenticateToken } from '../middleware/AuthenticateToken';
import {getExercisePlanController} from "../controllers/ExercisePlanController";
import {getUserByIdController} from "../controllers/UserController";

const router = express.Router();

router.get("/getExercisePlan/:userId", getExercisePlanController )
router.get("/getUser/:userId", getUserByIdController)

export default router;
