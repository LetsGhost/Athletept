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

// Import routes
const router = express.Router();

// User
router.post('/register', upload.fields([{name: "exerciseFile", maxCount: 1}, {name: "warmupFile", maxCount: 1}]), userController.registerUser); // Is Documented
router.get("/getUser/:userId", userController.getUserById) // Is Documented
router.delete("/deleteUser/:userId", userController.deleteUser) // Is Documented
router.get("/getAllUsers", userController.getAllUsers)

// Exercise plan
router.get("/getExercisePlan/:userId", exercisePlanController.getExercisePlan ) // Is Documented

// Message
router.post("/createMessage/:userId", messageController.createMessage) // Is Documented

// Protocol
router.get("/getProtocol/:userId", protocolController.getProtocol) // Is Documented

export default router;
