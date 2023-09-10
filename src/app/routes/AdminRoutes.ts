import express from 'express';
import {deleteUserController, registerUserController} from "../controllers/AdminController";
import { getExercisePlanController } from "../controllers/ExercisePlanController";
import { authenticateToken } from '../middleware/AuthenticateToken';
import { upload } from '../../config/multerConfig';
import { authenticateRole } from '../middleware/AuthenticateRole';
import {getUserByIdController} from "../controllers/UserController";
import {createMessageController} from "../controllers/MessagesController";
import {getProtocolController} from "../controllers/ProtocolController";

const router = express.Router();

//Register user
router.post('/register', upload.single('excelFile'), registerUserController);
router.get("/getUser/:userId", getUserByIdController)
router.delete("/deleteUser/:userId", deleteUserController)

//Exercise plan
router.get("/getExercisePlan/:userId", getExercisePlanController )

//Message
router.post("/createMessage/:userId", createMessageController)

//Protocol
router.get("/getProtocol/:userId", getProtocolController)

export default router;
