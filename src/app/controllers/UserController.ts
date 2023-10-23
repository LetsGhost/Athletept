import { Request, Response } from "express";
import userService from "../services/UserService";
import path from "path";
import exercisePlanService from "../services/ExercisePlanService";
import fs from "fs";
//import { File } from "multer";

class UserController{
    async registerUser(req: Request, res: Response) {
        try {
            const { email, password, userInfo } = req.body;

            if (!req.files) {
                return res.status(400).json({ message: 'No file provided' });
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
            const newUser = await userService.registerUser({ email: email as string, password: password as string }, userInfo as object);

            // Create exercise plan from Excel file
            await exercisePlanService.createExercisePlanFromExcel(newUser._id, exerciseFilePath, warmupFilePath);

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

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Registration failed', error: error });
        }
    };

    async deleteUser(req: Request, res: Response) {
        try {
            const { userId } = req.params;

            await userService.deleteUserById(userId);

            res.status(201).json({ message: 'User deleted successfully' });
        } catch (error) {
            console.log(error)
            res.status(400).json({ message: 'Delete failed', error: error });
        }
    }

    async getUserById(req: Request,res: Response ) {
        try {
            const { userId } = req.params;

            const user = await userService.getUserById(userId);
            res.status(200).json(user);
        } catch (error) {
            res.status(404).json({ message: error });
        }
    }
}

export default new UserController();