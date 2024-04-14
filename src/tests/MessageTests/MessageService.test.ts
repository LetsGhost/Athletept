import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import MessageService from '../../app/services/MessageService';
import UserService from '../../app/services/UserService';

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
    it('should return success: true', async () => {
      // Arrange
      const message = 'Hello, world!';
      const userId = NewUserId;

      // Act
      const result = await MessageService.createMessage(message, userId);

      // Assert
      expect(result.success).toBe(true);
    });
  });
  describe("createMessage with userId = null", () => {
    it("should return success: false", async () => {
      // Arrange
      const message = "Hello, world!";
      const userId = "null";

      // Act
      const result = await MessageService.createMessage(message, userId);

      // Assert
      expect(result.success).toBe(false);
    })
  });
});