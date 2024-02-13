import logger from '../../config/winstonLogger';
import UserModel from '../models/UserModel';
import { ProtocolExercisePlanDocument } from '../models/ProtocolModel';
import ExerciseAnalyticsModel, { exerciseAnalyticsDocument } from '../models/ExerciseAnalyticsModel';

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

      let exercises = exerciseAnalytics?.exerciseAnalytics.exerciseRanking.exercises || [];
      let topExercises = [];

      if (exercises.length === 0) {
        // If exercises array is empty, create new exercise entries based on the protocol
        for(let day of protocol.protocolExercisePlan.exerciseDays){
          for(let protocolExercise of day.exercises){
            exercises.push({
              name: protocolExercise.Exercises,
              topWeight: Math.max(...protocolExercise.Weight),
              lastWeights: protocolExercise.Weight.slice(-16),
              date: new Date()
            });
          }
        }
      } else {
        for(let exercise of exercises){
          const protocolExercise = protocol.protocolExercisePlan.exerciseDays.flatMap(day => day.exercises).find(e => e.Exercises === exercise.name);
        
          if (protocolExercise) {
            for(let weight of protocolExercise.Weight){
              if (weight > exercise.topWeight) {
                exercise.topWeight = weight;
                exercise.lastWeights.push(weight);
                if (exercise.lastWeights.length > 16) {
                  exercise.lastWeights.shift(); // Remove the oldest weight
                }
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