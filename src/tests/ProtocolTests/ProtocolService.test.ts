import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

import UserService from '../../app/services/UserService';
import ProtocolService from '../../app/services/ProtocolService';
import { ProtocolExerciseDay } from '../../app/models/ProtocolModel';
import UserModel from '../../app/models/UserModel';

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

      const user = await UserService.getUserById(NewUserId);

      user.user?.oldProtocol.push(user.user?.protocolExercisePlan.toString());

      // Remove the protocolExercisePlan field from the user document
      await UserModel.updateOne(
        { _id: user.user?._id },
        { $unset: { protocolExercisePlan: 1 } }
      );

      await user.user?.save();

      expect(success).toBe(true);
      expect(code).toBe(201);
      expect(newProtocol?.exerciseDays).toHaveLength(1);
      expect(newProtocol?.exerciseDays[0].exercises[0].Exercises).toBe('Bankdrücken');
    });
    describe('getOldProtocol', () => {
        it('Should retrieve old protocols', async () => {
            // Create multiple protocols
            const protocol1: ProtocolExerciseDay = {
                dayNumber: 2,
                type: "Unterkörper",
                exercises: [
                    {
                        Exercises: "Kniebeugen",
                        Weight: [60, 70, 80],
                        Repetitions: [10, 8, 6]
                    }
                ],
                comment: {
                    Scale: 4,
                    Notes: "Kniebeugen waren anstrengend"
                }
            };

            const protocol2: ProtocolExerciseDay = {
                dayNumber: 3,
                type: "Cardio",
                exercises: [
                    {
                        Exercises: "Laufen",
                        Weight: [],
                        Repetitions: [30] // 30 minutes
                    }
                ],
                comment: {
                    Scale: 3,
                    Notes: "Laufen war okay"
                }
            };

            const protocol3: ProtocolExerciseDay = {
                dayNumber: 4,
                type: "Rücken",
                exercises: [
                    {
                        Exercises: "Kreuzheben",
                        Weight: [70, 80, 90],
                        Repetitions: [10, 8, 6]
                    }
                ],
                comment: {
                    Scale: 5,
                    Notes: "Kreuzheben war super"
                }
            };

            // Create protocols for the user
            const user = await UserService.getUserById(NewUserId);

            await ProtocolService.createProtocol(NewUserId, protocol1);

            if (user.user?.protocolExercisePlan) {
              user.user.oldProtocol.push(user.user.protocolExercisePlan.toString());
            }

            // Remove the protocolExercisePlan field from the user document
            await UserModel.updateOne(
              { _id: user.user?._id },
              { $unset: { protocolExercisePlan: 1 } }
            );

            await user.user?.save();

            await ProtocolService.createProtocol(NewUserId, protocol2);

            if (user.user?.protocolExercisePlan) {
              user.user.oldProtocol.push(user.user.protocolExercisePlan.toString());
            }

            // Remove the protocolExercisePlan field from the user document
            await UserModel.updateOne(
              { _id: user.user?._id },
              { $unset: { protocolExercisePlan: 1 } }
            );

            await user.user?.save();

            await ProtocolService.createProtocol(NewUserId, protocol3);

            if (user.user?.protocolExercisePlan) {
              user.user.oldProtocol.push(user.user.protocolExercisePlan.toString());
            }

            // Remove the protocolExercisePlan field from the user document
            await UserModel.updateOne(
              { _id: user.user?._id },
              { $unset: { protocolExercisePlan: 1 } }
            );

            await user.user?.save();

            // Retrieve old protocols
            const { success, code, oldProtocols } = await ProtocolService.getOldProtocol(NewUserId, 3);

            expect(success).toBe(true);
            expect(code).toBe(200);
            expect(oldProtocols).toHaveLength(3);
            expect(oldProtocols![0].exerciseDays[0].exercises).toBe('Kniebeugen');
            expect(oldProtocols![1].exerciseDays[0].exercises).toBe('Laufen');
            expect(oldProtocols![2].exerciseDays[0].exercises).toBe('Kreuzheben');
        });
    });
  });
});