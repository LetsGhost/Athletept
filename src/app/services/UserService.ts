import UserModel from '../models/UserModel';
import {ExercisePlan} from "../models/ExercisePlanModel";
import {Message, MessageModel} from "../models/MessagModel";
import {ProtocolExercisePlan} from "../models/ProtocolModel";
import {TrainingDuration} from "../models/TrainingdurationModel";

interface RegistrationData {
    email: string;
    password: string;
}

class UserService{
    async registerUser(registrationData: RegistrationData, userInfo: object) {
        const { email, password } = registrationData;

        // Check if the email is already registered
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            throw new Error('Email already registered');
        }

        // Create a new user
        const newUser = new UserModel({
            email,
            password,
            userInfo
        });

        await newUser.save();
        return newUser;
    };

    async getUserById(userId: string) {
        const user = await UserModel.findById(userId);

        if(!user){
            throw new Error("User not found!")
        }

        return user;
    }

    async deleteUserById(userId: string) {

        const user = await UserModel.findById(userId);

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
        // WeekDisplay doesnt exist jet
        /* Checkin doesnt exist jet
        if(user?.checkIn){
            await CheckIn.findByIdAndDelete(user.checkIn);
        }
         */
        if (user){
            await UserModel.findByIdAndDelete(userId);
        }

        if(!user){
            throw new Error("User not found!")
        }

        return user;
    }

    async getAllUsers() {
        const users = await UserModel.find();

        if(!users){
            throw new Error("Users not found!")
        }

        return users;
    }
}

export default new UserService();