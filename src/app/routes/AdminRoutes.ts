import express from 'express';

// Multer config
import { upload } from '../../config/multerConfig.js';

// Import Middlewares
// Disable authentication for now
import authenticateRole from "../middleware/AuthenticateRole.js";
import authenticateToken from "../middleware/AuthenticateToken.js";

// Import Controllers
import userController from "../controllers/UserController.js";
import messageController from "../controllers/MessageController.js";
import protocolController from "../controllers/ProtocolController.js";
import exercisePlanController from "../controllers/ExercisePlanController.js";
import weekDisplayController from '../controllers/WeekDisplayController.js';
import checkInController from '../controllers/CheckInController.js';
import WeightAnalyticsController from '../controllers/WeightAnalyticsController.js';
import trainingDurationController from '../controllers/TrainingDurationController.js';

// Import routes
const router = express.Router();

// User
router.post('/register', upload.fields([{name: "exerciseFile", maxCount: 1}, {name: "warmupFile", maxCount: 1}]), userController.registerUser); // Is Documented
router.get("/getUser/:userId", userController.getUserById) // Is Documented
router.delete("/deleteUser/:userId", userController.deleteUser) // Is Documented
router.get("/getAllUsers", userController.getAllUsers) // Is Documented
router.post("/createAdmin", userController.createAdmin) 
router.get("/downloadUserInfo/:userId", userController.downLoadUserInfo) // Is Documented
router.get("/getAdmins", userController.getAdmins) 
router.patch("/updateUserInfo/:userId", userController.updateUserInfo)

// Exercise plan
router.get("/getExercisePlan/:userId", exercisePlanController.getExercisePlan ) // Is Documented
router.post("/createExercisePlan/:userId", upload.fields([{name: "exerciseFile", maxCount: 1}, {name: "warmupFile", maxCount: 1}]), exercisePlanController.createExercisePlan) // Is Documented
router.post("/createExercisePlanOnly/:userId", upload.fields([{name: "exerciseFile", maxCount: 1}]), exercisePlanController.createExercisePlan) // Is Documented
//router.post("/createWarmupOnly/:userId", upload.fields([{name: "warmupFile", maxCount: 1}]), exercisePlanController.createWarmupOnly)

// Message
router.post("/createMessage/:userId", messageController.createMessage) // Is Documented
router.get("/getAllMessages/:userId", messageController.getAllMessagesFromUser) // Is Documented
router.delete("/deleteMessageById/:messageId", messageController.deleteMessageById) // Is Documented

// Protocol
router.get("/getProtocol/:userId", protocolController.getProtocol) // Is Documented
router.get("/downloadProtocol/:userId", protocolController.downloadProtocol)

// WeekDisplay
router.post("/createWeekDisplay/:userId", weekDisplayController.createWeekDisplay) // Is Documented
router.get("/getWeekDisplay/:userId", weekDisplayController.getWeekDisplay) // Is Documented
router.patch("/updateWeekDisplay/:userId", weekDisplayController.updateWeekDisplay) // Is Documented

// CheckIn
router.get("/getCheckIn/:userId", checkInController.getCheckIn) // Is Documented
router.get("/downloadCheckIn/:userId", checkInController.downloadCheckIn) // Is Documented

// TrainingDuration
router.get("/getTrainingDuration/:userId", trainingDurationController.getTrainingDuration) // Is Documented

// Test will be deletet for production
router.post("/analytic/:userId", WeightAnalyticsController.createWeightAnalytics) 
router.post("/training/:userId", trainingDurationController.createTrainingDuration)

export default router;
