import express from 'express';

// Multer config
import { upload } from '../../config/multerConfig';

// Import Middlewares
// Disable authentication for now
import authenticateRole from "../middleware/AuthenticateRole";
import authenticateToken from "../middleware/AuthenticateToken";

// Import Controllers
import userController from "../controllers/UserController";
import messageController from "../controllers/MessageController";
import protocolController from "../controllers/ProtocolController";
import adminController from "../controllers/AdminController";
import exercisePlanController from "../controllers/ExercisePlanController";
import weekDisplayController from '../controllers/WeekDisplayController';
import checkInController from '../controllers/CheckInController';

// Import routes
const router = express.Router();

// User
router.post('/register', upload.fields([{name: "exerciseFile", maxCount: 1}, {name: "warmupFile", maxCount: 1}]), userController.registerUser); // Is Documented
router.get("/getUser/:userId", userController.getUserById) // Is Documented
router.delete("/deleteUser/:userId", userController.deleteUser) // Is Documented
router.get("/getAllUsers", userController.getAllUsers) // Is Documented

// Exercise plan
router.get("/getExercisePlan/:userId", exercisePlanController.getExercisePlan ) // Is Documented
router.post("/createExercisePlanOnly/:userId", upload.fields([{name: "exerciseFile", maxCount: 1}]), exercisePlanController.createExercisePlanOnly)
//router.post("/createWarmupOnly/:userId", upload.fields([{name: "warmupFile", maxCount: 1}]), exercisePlanController.createWarmupOnly)

// Message
router.post("/createMessage/:userId", messageController.createMessage) // Is Documented
router.get("/getAllMessages/:userId", messageController.getAllMessagesFromUser)
router.delete("/deleteMessageById/:messageId", messageController.deleteMessageById)
router.get("/getMessageById/:messageId", messageController.getMessageById)

// Protocol
router.get("/getProtocol/:userId", protocolController.getProtocol) // Is Documented

// WeekDisplay
router.post("/createWeekDisplay/:userId", weekDisplayController.createWeekDisplay) // Is Documented
router.get("/getWeekDisplay/:userId", weekDisplayController.getWeekDisplay) // Is Documented
router.patch("/updateWeekDisplay/:userId", weekDisplayController.updateWeekDisplay) // Is Documented

// CheckIn
router.get("/getCheckIn/:userId", checkInController.getCheckIn) // Is Documented

export default router;
