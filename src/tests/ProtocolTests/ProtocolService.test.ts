import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import UserService from '../../app/services/UserService';
import ProtocolService from '../../app/services/ProtocolService';
import { ProtocolExerciseDay } from '../../app/models/ProtocolModel';

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

const mockProtocol: ProtocolExerciseDay = {
    "dayNumber": 1,
    "type": "Oberkörper",
    "exercises": [
      {
        "Exercises": "Bankdrücken",
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
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {});

  // Create a user
  const user = await UserService.registerUser(mockUser, mockUserInfo.userInfo);
  NewUserId = user.newUser?._id;
});

// Close the in-memory server
afterAll(async () => {
  await mongoose.connection.close();
  await mongoServer.stop();
});

describe('Protocol', () => {
  describe('createProtocol', () => {
    it('Should create a protocol', async () => {
      const { success, code, message, newProtocol } = await ProtocolService.createProtocol(NewUserId, mockProtocol);
      console.log(newProtocol)
      expect(success).toBe(true);
      expect(code).toBe(201);
      expect(newProtocol?.exerciseDays).toHaveLength(1);
      expect(newProtocol?.exerciseDays[0].exercises[0].Exercises).toBe('Bankdrücken');
    });
  });
});