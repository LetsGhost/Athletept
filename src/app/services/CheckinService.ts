import { CheckIn } from "../models/CheckInModel"
import UserModel from "../models/UserModel";

interface currentGrowth {
    answer: string;
    boolean: boolean;
}

interface problems{
    answer: string;
    boolean: boolean;
}

interface regeneration{
    answer: boolean;
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

interface request {
    currentGrowth: { answer: string, boolean: boolean },
    problems: { answer: string, boolean: boolean },
    regeneration: { boolean: boolean },
    change: { answer: string, boolean: boolean }
  }

class CheckInService {
    async createCheckIn(userId: string, checkIn: request){
        try{
            const user = await UserModel.findById(userId)
            const userCheckIn = await CheckIn.findOne({user: userId})
            if(!user){
                throw new Error("User not found")
            }

            if(userCheckIn?.checkInStatus){
                return "Check-in is not available at this time"
            }

            const currentGrowth = checkIn.currentGrowth
            const problems = checkIn.problems
            const regeneration = checkIn.regeneration
            const change = checkIn.change
            
        } catch(err){
            console.log(err)
            throw new Error("Error creating check-in")
        }
    }
}

export default new CheckInService();