import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

// Import Middlewares
import authenticateToken from "../middleware/AuthenticateToken.js";

// Import Controllers
import exercisePlanController from "../controllers/ExercisePlanController.js";
import userController from "../controllers/UserController.js";
import messageController from "../controllers/MessageController.js";
import protocolController from "../controllers/ProtocolController.js";
import checkInController from "../controllers/CheckInController.js";
import weekDisplayController from '../controllers/WeekDisplayController.js';
import weightAnalyticsController from '../controllers/WeightAnalyticsController.js';
import trainingDurationController from '../controllers/TrainingDurationController.js';

// Import routes
const router = express.Router();

if(process.env.ENV === "production"){
    router.use(authenticateToken.authenticateToken);
}

// Exercise Plan
router.get("/getExercisePlan/:userId", exercisePlanController.getExercisePlan ) // Is Documented

// User
router.get("/getUser/:userId", userController.getUserById) // Is Documented
router.patch("/updatePassword/:userId", userController.updatePassword)

// Message
router.get("/getAllMessages/:userId", messageController.getAllMessagesFromUser) // Is Documented
router.get("/getMessageById/:messageId", messageController.getMessageById)

// Protocol
router.post("/createProtocol", protocolController.createProtocol) // Is Documented
router.post("/createBlankProtocol/:userId", protocolController.createBlankProtocol)

// Check-in
router.post("/createCheckIn/:userId", checkInController.createCheckIn) // Is Documented
router.get("/getCheckInStatus/:userId", checkInController.getCheckInStatus)

// Week Display
router.get("/getWeekDisplay/:userId", weekDisplayController.getWeekDisplay) // Is Documented

// Week Analytics
router.get("/getWeightAnalytics/:userId", weightAnalyticsController.getWeightAnalytics)

// Training Duration
router.get("/getTrainingDuration/:userId", trainingDurationController.getTrainingDuration) 

export default router;
