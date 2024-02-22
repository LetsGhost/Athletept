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
    it('Should create weight graphs and set in the weight', async () => {
      const { success, code, weightAnalytics } = await WeightAnalyticsService.updateBodyWeightArray(NewUserId, 50);

      expect(success).toBe(true);

      expect(weightAnalytics?.bodyWeight.actualWeight).toBe(50);
      expect(weightAnalytics?.bodyWeight.lastWeight).toBe(80);

      expect(weightAnalytics?.bodyWeightGraphs.weekWeights).toHaveLength(1);
      expect(weightAnalytics?.bodyWeightGraphs.weekWeights[0].weight).toBe(50)

      expect(weightAnalytics?.bodyWeightGraphs.allWeights).toHaveLength(2);
      expect(weightAnalytics?.bodyWeightGraphs.allWeights[1].weight).toBe(50);
      expect(weightAnalytics?.bodyWeightGraphs.allWeights[0].weight).toBe(80);
    });
    it("Should calculate the avg and set it in all the graphs", async () => {
      const { success, code, weightAnalytics } = await WeightAnalyticsService.updateBodyWeightArray(NewUserId, 70);

      expect(success).toBe(true);

      expect(weightAnalytics?.bodyWeightGraphs.weekWeights).toHaveLength(2);
      expect(weightAnalytics?.bodyWeightGraphs.weekWeights[1].weight).toBe(70);

      expect(weightAnalytics?.bodyWeightGraphs.allWeights).toHaveLength(2);
      expect(weightAnalytics?.bodyWeightGraphs.allWeights[1].weight).toBe(60);
      expect(weightAnalytics?.bodyWeightGraphs.allWeights[0].weight).toBe(80);
    })
    it("Should get the correct Weight Analytics", async () => {
      const { success, code, weightAnalytics } = await WeightAnalyticsService.getWeightAnalytics(NewUserId);
      console.log(weightAnalytics)
      expect(success).toBe(true);
    })
  });
});