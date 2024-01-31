import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import UserService from '../app/services/UserService';

import CheckInService from '../app/services/CheckInService';
import { check } from 'express-validator';

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

describe('MessageService', () => {
  describe('createMessage', () => {
    it('create a empty check-in, should return with default values', async () => {
      // Arrange
      const checkIn = {
        "currentGrowth": {
            "answer": "",
            "answer2": ""
        },
        "problems": {
            "answer": "",
            "boolean": true
        },
        "regeneration": {
            "answer": ""
        },
        "change": {
            "answer": "",
            "boolean": true
        },
        "weight": {
            "weight": 0
        },
        checkInStatus: true
      }

      // Act
      const result = await CheckInService.createCheckIn(NewUserId, checkIn);

      // Assert
      expect(result.success).toBe(true);
    });
  });
});