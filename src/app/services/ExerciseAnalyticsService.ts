import logger from '../../config/winstonLogger.js';
import UserModel from '../models/UserModel.js';
import { ProtocolExercisePlanDocument } from '../models/ProtocolModel.js';
import ExerciseAnalyticsModel, { exerciseAnalyticsDocument, ExerciseModel, exercise } from '../models/ExerciseAnalyticsModel.js';
import { Schema } from 'mongoose';
import { chownSync } from 'fs';

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

      user.exerciseAnalytics = exerciseAnalytics._id;
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

      let exercises = await ExerciseAnalyticsModel.findById(exerciseAnalytics?.exerciseAnalytics._id).populate<{ exercise: exercise[] }>("exerciseRanking.exercises");

      if (!exercises) {
        return {
          success: false,
          code: 404,
        };
      }

      let topExercises = [];

      if (exercises?.exercise === undefined) {
        console.log("No exercises found, creating new exercises");
        // If exercises array is empty, create new exercise entries based on the protocol
        for(let protocolExercise of lastDay.exercises){
          const exercise = await ExerciseModel.create({
            name: protocolExercise.Exercises,
            topWeight: Math.max(...protocolExercise.Weight),
            lastWeights: protocolExercise.Weight.slice(-16),
            date: new Date()
          });

          exercises.exerciseRanking.exercises.push(exercise._id);
        }

        // Get the updated exercises
        exercises = await ExerciseAnalyticsModel.findById(exerciseAnalytics?.exerciseAnalytics._id).populate<{ exercise: exercise[] }>("exerciseRanking.exercises");
        await exercises?.save();
        console.log(exercises); 
      } else {
        // Iterate over each exercise in the exercises array
        for(let exercise of exercises?.exercise){
          // Find the corresponding exercise in the protocol's exercise plan
          const protocolExercise = lastDay.exercises.find(e => e.Exercises === exercise.name);

          // If a corresponding exercise was found in the protocol's exercise plan
          if (protocolExercise) {
            // Iterate over each weight in the protocol exercise's Weight array
            for(let weight of protocolExercise.Weight){
              // If the current weight is greater than the exercise's topWeight
              if (weight > exercise.topWeight) {
                // Update the exercise's topWeight to the current weight
                exercise.topWeight = weight;
                // Add the current weight to the exercise's lastWeights array
                exercise.lastWeights.push(weight);
                // If the exercise's lastWeights array has more than 16 elements
                if (exercise.lastWeights.length > 16) {
                  // Remove the first element from the exercise's lastWeights array
                  exercise.lastWeights.shift();
                }
              }
            }
          }
        }
      }
      console.log(exercises)
      // Sort the exercises by topWeight in descending order
      exercises?.exercise.sort((a, b) => b.topWeight - a.topWeight);

      if (exerciseAnalytics) {
        if (exercises?.exercise) {
          topExercises = exercises.exercise.slice(0, 4);
          
          for (let exercise of topExercises) {
            exerciseAnalytics.exerciseAnalytics.topExercises.exercises.push(exercise._id);
          }
          
          for(let exercise of exercises.exercise){
            exerciseAnalytics.exerciseAnalytics.exerciseRanking.exercises.push(exercise._id);
          }
        } else {
          console.log(`No exercises found for ID ${exerciseAnalytics?.exerciseAnalytics._id}`);
        }

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

  async getExerciseRanking(userId: string, page: number, limit: number) {
    try{
      const user = await UserModel.findById(userId);
      if (!user) {
        return {
          success: false,
          code: 404,
          message: 'User not found',
        };
      }
  
      const skip = (page - 1) * limit;
  
      const populatedUser = await UserModel.populate<{ exerciseAnalytics: exerciseAnalyticsDocument }>(user, {
        path: "exerciseAnalytics",
        populate: {
          path: "exerciseRanking.exercises",
          options: {
            skip: skip,
            limit: limit
          }
        }
      });
      console.log(populatedUser.exerciseAnalytics.exerciseRanking.exercises);
  
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