import express from 'express';
import { registerUserController } from "../controllers/AdminController";
import { getExercisePlanController } from "../controllers/ExercisePlanController";
import { authenticateToken } from '../middleware/AuthenticateToken';
import { upload } from '../../config/multerConfig';
import { authenticateRole } from '../middleware/AuthenticateRole';
import {getUserByIdController} from "../controllers/UserController";
import {createMessageController} from "../controllers/MessagesController";

const router = express.Router();

//Register user
router.post('/register', upload.single('excelFile'), registerUserController);

//Exercise plan
router.get("/getExercisePlan/:userId", getExercisePlanController )

//User
router.get("/getUser/:userId", getUserByIdController)

//Message
router.post("/createMessage/:userId", createMessageController)

export default router;
