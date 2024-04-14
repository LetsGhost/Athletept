import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import UserService from '../../app/services/UserService';
import WeightAnalyticsService from '../../app/services/WeightAnalyticsService';

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
  await WeightAnalyticsService.createWeightAnalytics(NewUserId);
});

// Close the in-memory server
afterAll(async () => {
  await mongoose.connection.close();
  await mongod.stop();
});

describe('WeightAnalytics', () => {
  describe('updateWeightGraphs', () => {
    it("Should delete the Weight", async () => {
      const result = await WeightAnalyticsService.updateBodyWeightArray(NewUserId, 40);
      const result1 = await WeightAnalyticsService.updateBodyWeightArray(NewUserId, 70); // <- This is the weight we want to delete

      const { success, code, message, weightAnalytics } = await WeightAnalyticsService.deleteWeight(NewUserId, 1);

      expect(success).toBe(true);
      expect(weightAnalytics?.bodyWeightGraphs.allWeights.length).toBe(1);
      expect(weightAnalytics?.bodyWeightGraphs.allWeights[0].weight).toBe(40);

      expect(weightAnalytics?.bodyWeightGraphs.weekWeights.length).toBe(1);
      expect(weightAnalytics?.bodyWeightGraphs.weekWeights[0].weight).toBe(40);
    })
  });
});