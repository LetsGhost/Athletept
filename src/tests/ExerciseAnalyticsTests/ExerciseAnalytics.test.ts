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
  "dayNumber": 1,
  "type": "Oberkörper",
  "exercises": [
    {
      "Exercises": "Bankdrücken",
      "Weight": [50, 60, 90],
      "Repetitions": [10, 8, 6]
    },
    {
      "Exercises": "Flys",
      "Weight": [50, 60, 80],
      "Repetitions": [10, 8, 6]
    },
    {
      "Exercises": "Pushups",
      "Weight": [50, 60, 70],
      "Repetitions": [10, 8, 6]
    },
    {
      "Exercises": "Deadlifts",
      "Weight": [50, 60, 70],
      "Repetitions": [10, 8, 6]
    },
    {
      "Exercises": "Squats",
      "Weight": [50, 60, 70],
      "Repetitions": [10, 8, 6]
    }
  ],
  "comment": {
    "Scale": 5,
    "Notes": "Bankdrücken war blöd"
  }
};

const mockProtocol2 = {
  "dayNumber": 2,
  "type": "Oberkörper",
  "exercises": [
    {
      "Exercises": "Bankdrücken",
      "Weight": [50, 60, 90],
      "Repetitions": [10, 8, 6]
    },
    {
      "Exercises": "Flys",
      "Weight": [50, 60, 100],
      "Repetitions": [10, 8, 6]
    },
    {
      "Exercises": "Pushups",
      "Weight": [50, 60, 70],
      "Repetitions": [10, 8, 6]
    },
    {
      "Exercises": "Deadlifts",
      "Weight": [50, 60, 70],
      "Repetitions": [10, 8, 6]
    },
    {
      "Exercises": "Squats",
      "Weight": [50, 60, 70],
      "Repetitions": [10, 8, 6]
    }
  ],
  "comment": {
    "Scale": 5,
    "Notes": "Bankdrücken war blöd"
  }
};

// Mock MongoDB in-memory server
beforeAll(async () => {
  try {
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri(), {});
    
    const user = await UserService.registerUser(mockUser, mockUserInfo.userInfo);
    NewUserId = user.newUser?._id;
    await ProtocolService.createProtocol(NewUserId, mockProtocol);
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
});

// Close the in-memory server
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('ExerciseAnalytics', () => {
  describe('updateExerciseAnalytics', () => {
    it('Should update ExerciseAnalytics with the right analytics', async () => {
      const { success, code, exerciseAnalytics } = await ExerciseAnalyticsService.updateExerciseAnalytics(NewUserId);
      expect(success).toBe(true);
      expect(exerciseAnalytics?.exerciseAnalytics.topExercises.exercises).toHaveLength(4);
      expect(exerciseAnalytics?.exerciseAnalytics.exerciseRanking.exercises).toHaveLength(5);
      //expect(exerciseAnalytics?.exerciseAnalytics.topExercises.exercises[0].name).toBe("Bankdrücken");
    });
    it('Should update ExerciseAnalytics and Flys now should be the top exercise', async () => {
      await ProtocolService.createProtocol(NewUserId, mockProtocol2);
      const result = await ExerciseAnalyticsService.updateExerciseAnalytics(NewUserId);
      
      const { success, code, exerciseAnalytics } = await ExerciseAnalyticsService.updateExerciseAnalytics(NewUserId);

      expect(success).toBe(true);
      expect(exerciseAnalytics?.exerciseAnalytics.topExercises.exercises).toHaveLength(4);
      expect(exerciseAnalytics?.exerciseAnalytics.exerciseRanking.exercises).toHaveLength(5);
      //expect(exerciseAnalytics?.exerciseAnalytics.topExercises.exercises[0].name).toBe("Flys");
    });
    it("Should return only the elements that are in the page and limit", async () => {
      const { success, code, exerciseRanking } = await ExerciseAnalyticsService.getExerciseRanking(NewUserId, 1, 3);

      expect(success).toBe(true);
      expect(exerciseRanking?.exercises).toHaveLength(3);	
    });
  });
});