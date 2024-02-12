import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import UserService from '../app/services/UserService';
import ExerciseAnalyticsService from '../app/services/ExerciseAnalyticsService';
import ProtocolService from '../app/services/ProtocolService';
import exp from 'constants';

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

const mockProtocol = {
  "Flys": {
    "Exercises": "Flys",
    "Weight": [10, 20, 30],
    "Repetitions": [50, 60,70]
  },
  "Squads": {
    "Exercises": "Squads",
    "Weight": [20, 30, 40],
    "Repetitions": [50, 60,70]
  },
  "Bankdrücken": {
    "Exercises": "Bankdrücken",
    "Weight": [10, 20, 70],
    "Repetitions": [50, 60,70]
  },
  "Deadlifts": {
    "Exercises": "Deadlifts",
    "Weight": [20, 30, 40],
    "Repetitions": [50, 60,70]
  },
  "Pushups": {
    "Exercises": "Pushups",
    "Weight": [20, 30, 40],
    "Repetitions": [50, 60,70]
  },
}

const mockComment = {  
  "comment": {
    "Scale": 5,
    "Notes": "Bankdrücken war blöd"
  }
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
  await ProtocolService.createProtocol(NewUserId, mockProtocol, mockComment);
});

// Close the in-memory server
afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

describe('WeightAnalytics', () => {
  describe('updateWeightGraphs', () => {
    it('Should create weight graphs and set in the weight', async () => {
      const { success, code, exerciseAnalytics } = await ExerciseAnalyticsService.updateExerciseAnalytics(NewUserId);

      expect(success).toBe(true);
      expect(exerciseAnalytics?.exerciseAnalytics.topExercises).toHaveLength(4);
      expect(exerciseAnalytics?.exerciseAnalytics.exerciseRanking).toHaveLength(5);
      expect(exerciseAnalytics?.exerciseAnalytics.topExercises[0].name).toBe("Bankdrücken");
    });
  });
});