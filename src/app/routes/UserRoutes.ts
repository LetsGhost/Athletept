import express from 'express';

// Import Middlewares
import authenticateToken from "../middleware/AuthenticateToken";

// Import Controllers
import exercisePlanController from "../controllers/ExercisePlanController";
import userController from "../controllers/UserController";
import messageController from "../controllers/MessageController";
import protocolController from "../controllers/ProtocolController";

// Import routes
const router = express.Router();

// Exercise Plan
router.get("/getExercisePlan/:userId", exercisePlanController.getExercisePlan )

// User
router.get("/getUser/:userId", userController.getUserById)

// Message
router.get("/getAllMessages/:userId", messageController.getAllMessagesFromUser)

// Protocol
router.post("/createProtocol", protocolController.createProtocol)

export default router;
