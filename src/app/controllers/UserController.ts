import { Request, Response } from "express";
import userService from "../services/UserService";
import path from "path";
import exercisePlanService from "../services/ExercisePlanService";
import fs from "fs";
import WeightAnalyticsService from "../services/WeightAnalyticsService";
import TrainingDurationService from "../services/TrainingdurationService";
//import { File } from "multer";

class UserController{
    async registerUser(req: Request, res: Response) {
        try {
            const { email, password, userInfo, trainingduration } = req.body;
            console.log(trainingduration)

            if (!req.files) {
                console.log("No files were uploaded.")
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

            return res.status(code).json({ success, message, newUser });
        } catch (error) {
            console.log("Error while registration in Controller: ", error)
            return res.status(500).json({ success: false, message: "Internal Server error" });
        }
    };

    async deleteUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            const {success, code, message} = await userService.deleteUserById(userId);

            res.status(code).json({ success, message });
        } catch (error) {
            console.log("Error while deleting user in Controller: ", error)
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async getUserById(req: Request,res: Response ) {
        try {
            const { userId } = req.params;

            const { success, code, message, user } = await userService.getUserById(userId);

            return res.status(code).json({success, message, user});
        } catch (error) {
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
            console.log("Error while updating password in Controller: ", error)
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async createAdmin(req: Request, res: Response) {
        try{
            const { email, password } = req.body;

            const {success, code, message} = await userService.createAdminUser({email: email as string, password: password as string});

            res.status(code).json({success, message});
        } catch (error) {
            console.log("Error while creating admin in Controller: ", error)
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async downLoadUserInfo(req: Request, res: Response) {
        try{
            const { userId } = req.params;

            const {success, code, message, pdfBuffer, user} = await userService.downloadUserData(userId);

            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${user?.userInfo.name}-${new Date()}.pdf`);
            res.status(code).send(pdfBuffer);
        } catch (error) {
            console.log("Error while downloading user info in Controller: ", error)
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }

    async getAdmins(req: Request, res: Response) {
        try{
            const {success, code, message, admins} = await userService.getAdmins();

            res.status(code).json({success, message, admins});
        } catch (error) {
            console.log("Error while getting admins in Controller: ", error)
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
}

export default new UserController();