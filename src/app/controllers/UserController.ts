import { Request, Response } from "express";
import userService from "../services/UserService";
import path from "path";
import exercisePlanService from "../services/ExercisePlanService";
import fs from "fs";
import WeightAnalyticsService from "../services/WeightAnalyticsService";
import TrainingDurationService from "../services/TrainingdurationService";
import logger from "../../config/winstonLogger";
import getClientIp from "../utils/ipUtils";

class UserController{
    async registerUser(req: Request, res: Response) {
        try {
            const { email, password, userInfo, trainingduration } = req.body;

            if (!req.files) {
                return res.status(400).json({ success: false, message: 'No files were uploaded.' });
            }

            // I don´t know why this has to be here, but it works
            const uploadedFilePath = path.join();

            // Getting the files
            const excelFiles = req.files as Express.Multer.File[]

            // That`s very stupid I know but it works
            const toString = JSON.stringify(excelFiles)
            const toJSON = JSON.parse(toString)

            const exerciseFilePath = toJSON["exerciseFile"][0].path
            const warmupFilePath = toJSON["warmupFile"][0].path

            // Register the user
            const {success, code, message, newUser} = await userService.registerUser({ email: email as string, password: password as string }, userInfo as object);

            // Create exercise plan from Excel file
            await exercisePlanService.createExercisePlanFromExcel(newUser?._id, exerciseFilePath, warmupFilePath);

            await WeightAnalyticsService.createWeightAnalytics(newUser?._id);

            await TrainingDurationService.createTrainingduration(newUser?._id, trainingduration);

            // Deletes the files after the processing
            if (exerciseFilePath) {
                fs.unlink(exerciseFilePath, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }

            if (warmupFilePath) {
                fs.unlink(warmupFilePath, (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }

            if(success){
                logger.info('User registered: ' + newUser?._id, {service: 'UserController.registerUser'});
            }

            return res.status(code).json({ success, message, newUser });
        } catch (error) {
            logger.error('Error registering user:', error, {service: 'UserController.registerUser'});
            return res.status(500).json({ success: false, message: "Internal Server error" });
        }
    };

    async deleteUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            const {success, code, message} = await userService.deleteUserById(userId);

            if(success){
                logger.info('User deleted: ' + userId, {service: 'UserController.deleteUser'});
            }

            res.status(code).json({ success, message });
        } catch (error) {
            logger.error('Error deleting user:', error, {service: 'UserController.deleteUser'});
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async getUserById(req: Request,res: Response ) {
        try {
            const { userId } = req.params;

            const { success, code, message, user } = await userService.getUserById(userId);

            return res.status(code).json({success, message, user});
        } catch (error) {
            logger.error('Error getting user by id:', error, {service: 'UserController.getUserById'});
            return res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async getAllUsers(req: Request,res: Response ) {
        try {
            const {success, code, message, filteredUsers} = await userService.getAllUsers();
            res.status(code).json({success, message, filteredUsers});
        } catch (error) {
            console.log("Error while getting all users in Controller: ", error)
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async updatePassword(req: Request, res: Response) {
        try{
            const { userId } = req.params;
            const { password } = req.body;

            const {success, code, message} = await userService.updatePassword(userId, password);

            res.status(code).json({success, message});
        } catch (error) {
            logger.error('Error updating password:', error, {service: 'UserController.updatePassword'});
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async createAdmin(req: Request, res: Response) {
        try{
            const { email, password } = req.body;

            const {success, code, message} = await userService.createAdminUser({email: email as string, password: password as string});

            if(success){
                logger.info('Admin created from: ' + getClientIp(req), {service: 'UserController.createAdmin'});
            }

            res.status(code).json({success, message});
        } catch (error) {
            logger.error('Error creating admin:', error, {service: 'UserController.createAdmin'});
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async downLoadUserInfo(req: Request, res: Response) {
        try{
            const { userId } = req.params;

            const {success, code, message, pdfBuffer, user} = await userService.downloadUserData(userId);

            if(success){
                logger.info('User info downloaded: ' + userId, {service: 'UserController.downLoadUserInfo'});
            }

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${user?.userInfo.name}-${new Date()}.pdf`);
            res.status(code).send(pdfBuffer);
        } catch (error) {
            logger.error('Error downloading user info:', error, {service: 'UserController.downLoadUserInfo'});
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async getAdmins(req: Request, res: Response) {
        try{
            const {success, code, message, admins} = await userService.getAdmins();

            res.status(code).json({success, message, admins});
        } catch (error) {
            logger.error('Error getting admins:', error, {service: 'UserController.getAdmins'});
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async updateUserInfo(req: Request, res: Response) {
        try{
            const { userId } = req.params;
            const body = req.body;

            const {success, code, message} = await userService.updateUserInfo(userId, body);

            if(success){
                logger.info('User info updated: ' + userId, {service: 'UserController.updateUserInfo'});
            }

            res.status(code).json({success, message});
        } catch (error) {
            logger.error('Error updating user info:', error, {service: 'UserController.updateUserInfo'});
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
}

export default new UserController();