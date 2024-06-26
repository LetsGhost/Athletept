import logger from '../../config/winstonLogger.js';
import UserModel from '../models/UserModel.js';
import { ProtocolExercisePlanDocument } from '../models/ProtocolModel.js';
import ExerciseAnalyticsModel, { exerciseAnalyticsDocument } from '../models/ExerciseAnalyticsModel.js';

import mongoose from 'mongoose';

class ExerciseAnalyticsService {
  async createExerciseAnalytics(userId: string) {
    try{
      const user = await UserModel.findById(userId)

      if (!user) {
        return {
          success: false,
          code: 404,
        };
      }

      const exerciseAnalytics = await ExerciseAnalyticsModel.create({
        topExercises: {
          exercises: []
        },
        exerciseRanking: {
          exercises: []
        }
      });

      user.exerciseAnalytics = exerciseAnalytics._id as mongoose.Schema.Types.ObjectId;
      user.save();

      return {
        success: true,
        code: 201,
        exerciseAnalytics
      };
    } catch (error) {
      logger.error("Internal Server Error: ", error, {service: "ExerciseAnalyticsService.createExerciseAnalytics"});
      return {
        success: false,
        code: 500
      };
    }
  }

  async updateExerciseAnalytics(userId: string) {
    try{
      const user = await UserModel.findById(userId)

      if (!user) {
        return {
          success: false,
          code: 404,
        };
      }

      let exerciseAnalytics = await UserModel.findById(userId).populate<{ exerciseAnalytics: exerciseAnalyticsDocument }>("exerciseAnalytics");
      if (!exerciseAnalytics?.exerciseAnalytics) {
        await this.createExerciseAnalytics(userId).then(async (response) =>  {
          if (response.success) {
            exerciseAnalytics = await UserModel.findById(userId).populate<{ exerciseAnalytics: exerciseAnalyticsDocument }>("exerciseAnalytics");
          }
        });
      }

      // THIS IS THE RIGHT WAY TO DO IT Link: https://mongoosejs.com/docs/typescript/populate.html
      const protocol = await UserModel.findById(userId).populate<{ protocolExercisePlan: ProtocolExercisePlanDocument }>("protocolExercisePlan")

      if (!protocol) {
        return {
          success: false,
          code: 404,
        };
      }      

      // Get the last day from the protocol
      let lastDay = protocol.protocolExercisePlan.exerciseDays[protocol.protocolExercisePlan.exerciseDays.length - 1];

      let exercises = exerciseAnalytics?.exerciseAnalytics.exerciseRanking.exercises || [];


      if (!exercises) {
        return {
          success: false,
          code: 404,
        };
      }

      let topExercises = [];

      if (exercises.length === 0) {
        // If exercises array is empty, create new exercise entries based on the protocol
        for(let protocolExercise of lastDay.exercises){
          let avg = protocolExercise.Weight.reduce((a, b) => a + b, 0) / protocolExercise.Weight.length;
          let roundedNum = Number(avg.toFixed(2));

          exercises.push({
            name: protocolExercise.Exercises,
            topWeight: roundedNum,
            lastWeights: roundedNum > 0 ? [roundedNum] : protocolExercise.Weight.slice(-16),
            date: new Date()
          });
        }
      } else {
        // Check if an exercise does not exists in the exercises array
        for(let protocolExercise of lastDay.exercises){
          let exerciseIndex = exercises.findIndex(e => e.name === protocolExercise.Exercises);

          // If the exercise does not exist in the array create it
          if (exerciseIndex === -1) {
            let avg = protocolExercise.Weight.reduce((a, b) => a + b, 0) / protocolExercise.Weight.length;
            let roundedNum = Number(avg.toFixed(2));

            exercises.push({
              name: protocolExercise.Exercises,
              topWeight: roundedNum,
              lastWeights: roundedNum > 0 ? [roundedNum] : protocolExercise.Weight.slice(-16),
              date: new Date()
            });
          }
        }

        // Iterate over each exercise in the exercises array
        for(let exercise of exercises){
          // Find the corresponding exercise in the protocol's exercise plan
          const protocolExercise = lastDay.exercises.find(e => e.Exercises === exercise.name);

          // If a corresponding exercise was found in the protocol's exercise plan
          if (protocolExercise) {

            // If there are more than one weights in the array
            if (protocolExercise.Weight.length > 1) {
              let avgWeight = protocolExercise.Weight.reduce((a, b) => a + b, 0) / protocolExercise.Weight.length;
              let roundedNum = Number(avgWeight.toFixed(2));

              // If the average weight is greater than the exercise's topWeight
              if (avgWeight > exercise.topWeight) {
                exercise.topWeight = roundedNum;
              }

              // Always push avgWeight into lastWeights
              exercise.lastWeights.push(roundedNum);

              if (exercise.lastWeights.length > 16) {
                exercise.lastWeights.shift();
              }
            }
          }
        }
      }

      // Sort the exercises by topWeight in descending order
      exercises.sort((a, b) => b.topWeight - a.topWeight);

      if (exerciseAnalytics) {
        topExercises = exercises.slice(0, 4);
        exerciseAnalytics.exerciseAnalytics.topExercises = { exercises: topExercises };
        exerciseAnalytics.exerciseAnalytics.exerciseRanking = { exercises: exercises };

        exerciseAnalytics.exerciseAnalytics.save();

        return {
          success: true,
          code: 200,
          exerciseAnalytics
        };
      }

      return {
        success: false,
        code: 500
      };

    } catch (error) {
      logger.error("Internal Server Error: ", error, {service: "ExerciseAnalyticsService.updateExerciseAnalytics"});
      return {
        success: false,
        code: 500
      };
    }
  }

  async getTopExercises(userId: string) {
    try{
      const user = await UserModel.findById(userId).populate<{ exerciseAnalytics: exerciseAnalyticsDocument }>("exerciseAnalytics");

      if (!user) {
        return {
          success: false,
          code: 404,
        };
      }

      if (!user.exerciseAnalytics) {
        return {
          success: false,
          code: 404,
        };
      }

      return {
        success: true,
        code: 200,
        topExercises: user.exerciseAnalytics.topExercises
      }
    } catch(error) {
      logger.error("Internal Server Error: ", error, {service: "ExerciseAnalyticsService.getTopExercises"});
      return {
        success: false,
        code: 500
      };
    }
  }

  async getExerciseRanking(userId: string) {
    try{
      const user = await UserModel.findById(userId);
      if (!user) {
        return {
          success: false,
          code: 404,
          message: 'User not found',
        };
      }
  
      const populatedUser = await UserModel.populate<{ exerciseAnalytics: exerciseAnalyticsDocument }>(user, {
        path: "exerciseAnalytics",
        populate: {
          path: "exerciseRanking.exercises"
        }
      });

  
      if (!populatedUser.exerciseAnalytics) {
        return {
          success: false,
          code: 404,
          message: 'Exercise Analytics not found',
        };
      }

      return {
        success: true,
        code: 200,
        exerciseRanking: populatedUser.exerciseAnalytics.exerciseRanking
      };
    } catch(error) {
      logger.error("Internal Server Error: ", error, {service: "ExerciseAnalyticsService.getExerciseRanking"});
      return {
        success: false,
        code: 500
      };
    }
  }
}

export default new ExerciseAnalyticsService();