import UserModel from '../models/UserModel';
import {ExercisePlan} from "../models/ExercisePlanModel";
import {MessageModel} from "../models/MessagModel";
import {ProtocolExercisePlan} from "../models/ProtocolModel";
import {TrainingDuration} from "../models/TrainingdurationModel";
import {CheckIn} from "../models/CheckInModel";
import templateUtils from '../utils/templateUtils';
import { Types } from 'mongoose';
import logger from '../../config/winstonLogger';

interface RegistrationData {
    email: string;
    password: string;
}

interface User {
    _id: Types.ObjectId;
    [key: string]: any;
}

class UserService{
    async registerUser(registrationData: RegistrationData, userInfo: object) {
        try{
            const { email, password } = registrationData;

            // Check if the email is already registered
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return {
                    success: false,
                    code: 400,
                    message: "User already exists!"
                }
            }

            // Create a new user
            const newUser = new UserModel({
                email,
                password,
                userInfo
            });

            await newUser.save();

            return {
                success: true,
                code: 201,
                newUser
            };
        } catch (error) {
            logger.error('Error registering user:', error, {service: 'UserService.registerUser'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async getUserById(userId: string) {
        try{
            const user = await UserModel.findById(userId);

            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: "User not found!"
                }
            }

            return {
                success: true,
                code: 200,
                user
            }
        } catch (error) {
            logger.error('Error getting user by id:', error, {service: 'UserService.getUserById'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async deleteUserById(userId: string) {
        try{
            const user = await UserModel.findById(userId);

            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: "User not found!"
                }
            }

            // Delete all data from this user
            if(user?.exercisePlan){
                await ExercisePlan.findByIdAndDelete(user.exercisePlan);
            }
            if(user?.protocolExercisePlan){
                await ProtocolExercisePlan.findByIdAndDelete(user.protocolExercisePlan);
            }
            if(user?.messages){
                // Delete all found messages message ids are stored in a array
                for(const messageId of user.messages ){
                    await MessageModel.findByIdAndDelete(messageId);
                }
            }
            if (user?.trainingduration){
                await TrainingDuration.findByIdAndDelete(user.trainingduration);
            }
            if(user?.checkIn){
                await CheckIn.findByIdAndDelete(user.checkIn);
            }
            if (user){
                await UserModel.findByIdAndDelete(userId);
            }

            return {
                success: true,
                code: 200,
            }
        } catch (error) {
            logger.error('Error deleting user by id:', error, {service: 'UserService.deleteUserById'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async getAllUsers() {
        try{
            const users = await UserModel.find();

            if(!users){
                return {
                    success: false,
                    code: 404,
                    message: "Users not found!"
                }
            }

            const filteredUsers = users.filter(user => user.role !== 'admin');

            return {
                success: true,
                code: 200,
                filteredUsers
            }
        } catch (error) {
            logger.error('Error getting all users:', error, {service: 'UserService.getAllUsers'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async updatePassword(userId: string, newPassword: string) {
        try{
            const user = await UserModel.findById(userId);

            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: "User not found!"
                }
            }

            // Update the password
            user.password = newPassword;
            await user.save();

            return {
                success: true,
                code: 200,
                user
            }
        } catch(error){
            logger.error('Error updating password:', error, {service: 'UserService.updatePassword'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async createAdminUser(registrationData: RegistrationData) {
        try{
            const { email, password } = registrationData;

            // Check if the email is already registered
            const existingUser = await UserModel.findOne({ email });
            if (existingUser) {
                return {
                    success: false,
                    code: 400,
                    message: "User already exists!"
                }
            }

            const userInfo = {
                name: '-',
                goal: '-',
                focus: '-',
                targetWeight: 0,
                currentWeight: 0,
                DOB: new Date(),
                gender: '-',
                sports: '-',
                location: '-',
                conditions: '-',
                times: '-',
                frequency: '-',
                cardio: '-',
                issues: '-',
            }


            // Create a new user
            const newUser = new UserModel({
                email,
                password,
                role: 'admin',
                userInfo
            });

            await newUser.save();

            return {
                success: true,
                code: 201,
                newUser
            };
        } catch(error){
            logger.error('Error creating admin user:', error, {service: 'UserService.createAdminUser'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }

    }

    async downloadUserData(userId: string) {
        try{
            const user = await UserModel.findById(userId);

            if(!user){
                return {
                    success: false,
                    code: 404,
                    message: "User not found!"
                }
            }

            const templatePath = "userInfo.ejs";
            const html = templateUtils.renderTemplateWithData(templatePath, user);
            const pdfBuffer = await templateUtils.generatePdfFromTemplate(html);

            return {
                success: true,
                code: 200,
                pdfBuffer,
                user
            }
        } catch(error){
            logger.error('Error downloading user data:', error, {service: 'UserService.downloadUserData'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async getAdmins() {
        try{
            const admins = await UserModel.find({role: 'admin'});

            if(!admins){
                return {
                    success: false,
                    code: 404,
                    message: "Admins not found!"
                }
            }

            return {
                success: true,
                code: 200,
                admins
            }
        } catch (error) {
            logger.error('Error getting admins:', error, {service: 'UserService.getAdmins'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }

    async updateUserInfo(userId: string, newInfo: { [key: string]: any }) {
        try{
            // Check if newInfo is undefined or null
            if (!newInfo) {
                return {
                    success: false,
                    code: 400,
                    message: "No information provided for update!"
                };
            }
        
            // Find the user by userId
            const user = await UserModel.findById(userId);
            if (!user) {
                return {
                    success: false,
                    code: 404,
                    message: "User not found!"
                };
            }
        
            // Update the user's information
            Object.keys(newInfo).forEach((key) => {
                (user.userInfo as any)[key] = newInfo[key];
            });
        
            // Save the updated user information
            const updatedUser = await user.save();
        
            return {
                success: true,
                code: 200,
                updatedUser
            };
        } catch(error){
            logger.error('Error updating user info:', error, {service: 'UserService.updateUserInfo'});
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }
}

export default new UserService();