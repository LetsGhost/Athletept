import express from 'express';

// Multer config
import { upload } from '../../config/multerConfig';

// Import Middlewares
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
router.post('/register', upload.single('excelFile'), userController.registerUser);
router.get("/getUser/:userId", userController.getUserById)
router.delete("/deleteUser/:userId", userController.deleteUser)

// Exercise plan
router.get("/getExercisePlan/:userId", exercisePlanController.getExercisePlan )

// Message
router.post("/createMessage/:userId", messageController.createMessage)

// Protocol
router.get("/getProtocol/:userId", protocolController.getProtocol)

export default router;
