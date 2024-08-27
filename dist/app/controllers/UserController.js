import userService from "../services/UserService.js";
import WeightAnalyticsService from "../services/WeightAnalyticsService.js";
import TrainingDurationService from "../services/TrainingdurationService.js";
import ExerciseAnalyticsService from "../services/ExerciseAnalyticsService.js";
import logger from "../../config/winstonLogger.js";
import getClientIp from "../utils/ipUtils.js";
class UserController {
    async registerUser(req, res) {
        try {
            const { email, password, userInfo, trainingduration } = req.body;
            // Register the user
            const { success, code, message, newUser } = await userService.registerUser({ email: email, password: password }, userInfo);
            await WeightAnalyticsService.createWeightAnalytics(newUser?._id);
            await TrainingDurationService.createTrainingduration(newUser?._id, trainingduration);
            await ExerciseAnalyticsService.createExerciseAnalytics(newUser?._id);
            if (success) {
                logger.info('User registered: ' + newUser?._id, { service: 'UserController.registerUser' });
            }
            return res.status(code).json({ success, message, newUser });
        }
        catch (error) {
            logger.error('Error registering user:', error, { service: 'UserController.registerUser' });
            return res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
    ;
    async deleteUser(req, res) {
        try {
            const { userId } = req.params;
            const { success, code, message, deleteCount } = await userService.deleteUserById(userId);
            if (success) {
                logger.info('User deleted: ' + userId + " " + deleteCount + " total documents", { service: 'UserController.deleteUser' });
            }
            return res.status(code).json({ success, message });
        }
        catch (error) {
            logger.error('Error deleting user:', error, { service: 'UserController.deleteUser' });
            return res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
    async getUserById(req, res) {
        try {
            const { userId } = req.params;
            const { success, code, message, user } = await userService.getUserById(userId);
            return res.status(code).json({ success, message, user });
        }
        catch (error) {
            logger.error('Error getting user by id:', error, { service: 'UserController.getUserById' });
            return res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
    async getAllUsers(req, res) {
        try {
            const { success, code, message, filteredUsers } = await userService.getAllUsers();
            res.status(code).json({ success, message, filteredUsers });
        }
        catch (error) {
            logger.error('Error getting all users:', error, { service: 'UserController.getAllUsers' });
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
    async updatePassword(req, res) {
        try {
            const { userId } = req.params;
            const { password } = req.body;
            const { success, code, message } = await userService.updatePassword(userId, password);
            res.status(code).json({ success, message });
        }
        catch (error) {
            logger.error('Error updating password:', error, { service: 'UserController.updatePassword' });
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
    async createAdmin(req, res) {
        try {
            const { email, password } = req.body;
            const { success, code, message } = await userService.createAdminUser({ email: email, password: password });
            if (success) {
                logger.info('Admin created from: ' + getClientIp(req), { service: 'UserController.createAdmin' });
            }
            res.status(code).json({ success, message });
        }
        catch (error) {
            logger.error('Error creating admin:', error, { service: 'UserController.createAdmin' });
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
    async downLoadUserInfo(req, res) {
        try {
            const { userId } = req.params;
            const { success, code, message, pdfBuffer, user } = await userService.downloadUserData(userId);
            if (success) {
                logger.info('User info downloaded: ' + userId, { service: 'UserController.downLoadUserInfo' });
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${user?.userInfo.name}-${new Date()}.pdf`);
            res.status(code).send(pdfBuffer);
        }
        catch (error) {
            logger.error('Error downloading user info:', error, { service: 'UserController.downLoadUserInfo' });
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
    async getAdmins(req, res) {
        try {
            const { success, code, message, admins } = await userService.getAdmins();
            res.status(code).json({ success, message, admins });
        }
        catch (error) {
            logger.error('Error getting admins:', error, { service: 'UserController.getAdmins' });
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
    async updateUserInfo(req, res) {
        try {
            const { userId } = req.params;
            const body = req.body;
            const { success, code, message } = await userService.updateUserInfo(userId, body);
            if (success) {
                logger.info('User info updated: ' + userId, { service: 'UserController.updateUserInfo' });
            }
            res.status(code).json({ success, message });
        }
        catch (error) {
            logger.error('Error updating user info:', error, { service: 'UserController.updateUserInfo' });
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
}
export default new UserController();
