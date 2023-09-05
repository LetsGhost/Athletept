// src/routes/userRoutes.ts
import express from 'express';
import { authenticateToken } from '../middleware/AuthenticateToken';
import {getExercisePlanController} from "../controllers/ExercisePlanController";
import {getUserByIdController} from "../controllers/UserController";
import {getAllMessagesFromUser} from "../services/MessageService";

const router = express.Router();

router.get("/getExercisePlan/:userId", getExercisePlanController )

router.get("/getUser/:userId", getUserByIdController)

router.get("/getAllMessages/:userId", getAllMessagesFromUser)

export default router;
