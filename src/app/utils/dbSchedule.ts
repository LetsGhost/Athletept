import cron from 'node-cron';
import logger from '../../config/winstonLogger';

// Services
import UserService from '../services/UserService';

// Models
import { CheckIn } from '../models/CheckInModel';
import { WeekDisplay } from '../models/WeekDisplayModel';
import { ExercisePlan } from '../models/ExercisePlanModel';
import UserModel from '../models/UserModel';

async function dbSchedule() {
  const {success, code, message, filteredUsers} = await UserService.getAllUsers();

  if(!success){
    logger.error('Error getting all users:', message, {service: 'dbSchedule'});
    return;
  }

  const users = filteredUsers;

  const userIds = [];

  // Push all user ids into userIds array
  if(users){
    for(let i = 0; i < users.length; i++){
        const user = users[i];
        
        if(user.role === 'admin'){
            continue;
        }

        userIds.push(user._id);
      }
  }

  if(userIds){
    for(let id in userIds){
        const userId = userIds[id];

        // Set CheckInStatus to false and put the CheckIn id into the oldCheckIn array
        const user = await UserModel.findById(userId).populate("checkIn")
        const currentCheckIn = user?.checkIn as any;
        
        if(currentCheckIn){
            currentCheckIn.checkInStatus = false;
            await currentCheckIn.save();

            user?.oldCheckIn.push(currentCheckIn._id);
            await user?.save();
        }
    }
  }
}

export default dbSchedule;