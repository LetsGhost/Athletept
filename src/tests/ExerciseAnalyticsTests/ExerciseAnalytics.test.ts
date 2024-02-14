import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import UserService from '../../app/services/UserService';
import ExerciseAnalyticsService from '../../app/services/ExerciseAnalyticsService';
import ProtocolService from '../../app/services/ProtocolService';

let mongoServer: MongoMemoryServer;
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
    dayNumber: 1,
    dayType: "Oberkörper",
    exercises: {
      "Flys": {
        Weight: [50, 60, 90],
        Repetitions: [50, 60, 70]
      },
      "Squads": {
        Weight: [50, 60, 10],
        Repetitions: [50, 60, 70]
      },
      "Bankdrücken": {
        Weight: [50, 60, 70],
        Repetitions: [50, 60, 70]
      },
      "Pushups": {
        Weight: [50, 60, 70],
        Repetitions: [50, 60, 70]
      },
      "Deadlifts": {
        Weight: [50, 60, 70],
        Repetitions: [50, 60, 70]
      }
  }
};

const mockComment = {  
  "comment": {
    "Scale": 5,
    "Notes": "Bankdrücken war blöd"
  }
}

// Mock MongoDB in-memory server
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});

  // Create a user
  const user = await UserService.registerUser(mockUser, mockUserInfo.userInfo);
  NewUserId = user.newUser?._id;
  
  // @ts-ignore
  await ProtocolService.createProtocol(NewUserId, mockProtocol, mockComment);
});

// Close the in-memory server
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('WeightAnalytics', () => {
  describe('updateWeightGraphs', () => {
    it('Should create weight graphs and set in the weight', async () => {
      const { success, code, exerciseAnalytics } = await ExerciseAnalyticsService.updateExerciseAnalytics(NewUserId);

      expect(success).toBe(true);
      expect(exerciseAnalytics?.exerciseAnalytics.topExercises.exercises).toHaveLength(4);
      expect(exerciseAnalytics?.exerciseAnalytics.exerciseRanking.exercises).toHaveLength(5);
      expect(exerciseAnalytics?.exerciseAnalytics.topExercises.exercises[0].name).toBe("Flys");
    });
  });
});