import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import UserService from '../app/services/UserService';

import ExercisePlanService from '../app/services/ExercisePlanService';

let mongod: any;
let NewUserId: string;

// Mock user data
const mockUser = {
  "email": "user@example.com",
  "password": "securepassword",
}

const mockUserInfo = {
  "userInfo": {
    "name": "John Doe",
    "goal": "Lose weight",
    "focus": "Cardio",
    "targetWeight": 70,
    "currentWeight": 80,
    "DOB": "1990-01-01",
    "gender": "Male",
    "sports": "Running",
    "location": "New York",
    "conditions": "None",
    "times": "Morning",
    "frequency": "Daily",
    "cardio": "Yes",
    "issues": "None"
  },
}

// Mock MongoDB in-memory server
beforeAll(async () => {
  mongod = new MongoMemoryServer();
  await mongod.start();
  const mongoDBURL = await mongod.getUri();
  await mongoose.connect(mongoDBURL);

  // Create a user
  const user = await UserService.registerUser(mockUser, mockUserInfo.userInfo);
  NewUserId = user.newUser?._id;
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

describe('ExercisPlanService', () => {
  describe('createExerciseplan and check if the set rules are working', () => {
    it('create an exerciseplan that has more than 7 days, a false is expected', async () => {
        const exercisPlanPath = "src/tests/Trainingstabelle_for_testing.xlsx"
        const warmupExercisePath = "src/tests/warmuptabelle_for_testing.xlsx"

        const result = await ExercisePlanService.createExercisePlanFromExcel(NewUserId, exercisPlanPath, warmupExercisePath);

        expect(result).toEqual({
            success: false,
            code: 400,
            message: "The exercise plan has more than 7 days"
        });
    })
    it('create an exerciseplan that has an ExerciseDay without any exercises, a false is expected', async () => {
        const exercisPlanPath = "src/tests/Trainingstabelle_for_testing.xlsx"
        const warmupExercisePath = "src/tests/warmuptabelle_for_testing.xlsx"

        const result = await ExercisePlanService.createExercisePlanFromExcel(NewUserId, exercisPlanPath, warmupExercisePath);

        expect(result).toEqual({
            success: false,
            code: 400,
            message: "The exercise plan has more than 7 days"
        });
    })
  });
})