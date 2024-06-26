import logger from "../../config/winstonLogger.js";

// Services
import UserService from "../services/UserService.js";

// Models
import WeekDisplayModel from "../models/WeekDisplayModel.js";
import UserModel from "../models/UserModel.js";

async function dbSchedule() {
  try {
    const { success, code, message, filteredUsers } =
      await UserService.getAllUsers();

    if (!success) {
      logger.error("Error getting all users:", message, {
        service: "dbSchedule",
      });
      return {
        success: false
      }
    }

    const users = filteredUsers;

    const userIds = [];

    // Push all user ids into userIds array
    if (users) {
      for (let i = 0; i < users.length; i++) {
        const user = users[i];

        if (user.role === "admin") {
          continue;
        }

        userIds.push(user._id);
      }
    }

    let protocolCounter = 0;
    let checkInCounter = 0;
    let weekDisplayCounter = 0;
    let exercisePlanCounter = 0;
    let weightAnalyticsCounter = 0;

    if (userIds) {
      for (let id in userIds) {
        const userId = userIds[id];

        const user = await UserModel.findById(userId);
        const protocolId = user?.protocolExercisePlan;

        if (protocolId) {
          user?.oldProtocol.push(protocolId.toString());

          // Remove the protocolExercisePlan field from the user document
          await UserModel.updateOne(
            { _id: user._id },
            { $unset: { protocolExercisePlan: 1 } }
          );

          await user?.save();

          protocolCounter++;
        }

        // Set CheckInStatus to false and put the CheckIn id into the oldCheckIn array
        const userCheckIn = await UserModel.findById(userId).populate(
          "checkIn"
        );
        const currentCheckIn = userCheckIn?.checkIn as any;
        if (currentCheckIn && userCheckIn) {
          currentCheckIn.checkInStatus = false;
          await currentCheckIn.save();

          userCheckIn?.oldCheckIn.push(currentCheckIn._id);

          // Remove the checkIn field from the user document
          await UserModel.updateOne(
            { _id: userCheckIn._id },
            { $unset: { checkIn: 1 } }
          );

          await userCheckIn?.save();

          checkInCounter++;
        }

        const weekDisplay = await WeekDisplayModel.findById(user?.weekDisplay);

        if (weekDisplay) {
          weekDisplay.trainingDone = [];
          await weekDisplay.save();

          weekDisplayCounter++;
        }

        const userExercisePlan = await UserModel.findById(userId).populate(
          "exercisePlan"
        );
        const currentExercisePlan = userExercisePlan?.exercisePlan as any;

        if (currentExercisePlan) {
          // Iterate over each day in the exerciseDays array
          for (let day of currentExercisePlan.exerciseDays) {
            // Set trainingDone and trainingMissed to false
            day.trainingDone = false;
            day.trainingMissed = false;
          }

          await currentExercisePlan.save();

          exercisePlanCounter++;
        }

        const userWeightAnalytics = await UserModel.findById(userId).populate(
          "weightAnalytics"
        );
        const currentWeightAnalytics = userWeightAnalytics?.weightAnalytics as any;

        if (currentWeightAnalytics) {

          if(currentWeightAnalytics.bodyWeightGraphs){
            currentWeightAnalytics.bodyWeightGraphs.weekWeights = [];
            await currentWeightAnalytics.save();
  
            weightAnalyticsCounter++;
          }
        }
      }
    }

    logger.info(
      `Updated ${protocolCounter} protocols, ${checkInCounter} checkIns, ${weekDisplayCounter} weekDisplays, and ${exercisePlanCounter} exercisePlans, and ${weightAnalyticsCounter} weightAnalytics.`,
      { service: "dbSchedule" }
    );

    return {
      success: true,
    }
  } catch (error) {
    logger.error("Error running dbSchedule:", error, { service: "dbSchedule" });
    return {
      success: false,
    }
  }
}

export default dbSchedule;
