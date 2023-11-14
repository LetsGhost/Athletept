import { CheckIn } from "../models/CheckInModel"
import UserModel from "../models/UserModel";
import { Document, Model } from 'mongoose';

interface currentGrowth {
    answer: string;
    boolean: boolean;
}

interface problems{
    answer: string;
    boolean: boolean;
}

interface regeneration{
    boolean: boolean;
}

interface change{
    answer: string;
    boolean: boolean;
}

interface checkIn {
    currentGrowth: currentGrowth;
    problems: problems;
    regeneration: regeneration;
    change: change;
}

interface checkInDocument extends Document {
    createdAt: Date;
    checkInStatus: boolean
    checkIn: checkIn;
}

interface CheckInModel extends Model<checkInDocument> {}


interface request {
    currentGrowth: { answer: string, boolean: boolean },
    problems: { answer: string, boolean: boolean },
    regeneration: { boolean: boolean },
    change: { answer: string, boolean: boolean }
    checkInStatus: boolean
}

class CheckInService {
    async createCheckIn(userId: string, checkIn: request){
        try{
            const user = await UserModel.findById(userId)
            const userCheckIn = await UserModel.findById(userId).populate('checkIn');
            const currentCheckIn = (user?.checkIn as unknown) as CheckInModel;
            
            if(!user){
                console.log("User not found")
                return {
                    success: false,
                    code: 404,
                    message: "User not found"
                }
            }

            // TODO: Check if check-in already exists for this week and if the checkInStatus is true
            /*
            if(currentCheckIn?.checkInStatus){
                return {
                    success: false,
                    code: 400,
                    message: "Check-in already done for this week"
                }
            }
            */

            const createdAt = (user?.checkIn as any).createdAt;

            // Calculates the date that should be one week ago
            const currentDate = new Date();
            const oneWeekAgo = new Date();
            oneWeekAgo.setDate(currentDate.getDate() - 7);

            if(createdAt <= oneWeekAgo){
                console.log("Check-in already done for this week")
            }

            const currentGrowth = checkIn.currentGrowth
            const problems = checkIn.problems
            const regeneration = checkIn.regeneration
            const change = checkIn.change

            const newCheckIn = new CheckIn({
                checkIn: {
                    currentGrowth: currentGrowth,
                    problems: problems,
                    regeneration: regeneration,
                    change: change,
                },
                checkInStatus: true,
            })
            await newCheckIn.save()

            user.checkIn = newCheckIn._id
            await user.save()

            return {
                success: true,
                code: 200,
                checkIn: newCheckIn
            }            
        } catch(err){
            console.log("Error while creating check-in in CheckInService.createCheckIn: ", err)
            return {
                success: false,
                code: 500,
                message: "Internal Server error"
            }
        }
    }
}

export default new CheckInService();