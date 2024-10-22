import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import UserService from '../../app/services/UserService';
import UserModel from '../../app/models/UserModel';

let mongod: any;
let userId: string;

// Mock user data
const mockUser = {
    email: "user@example.com",
    password: "securepassword",
    userInfo: {
        name: "John Doe",
        goal: "Lose weight",
        focus: "Cardio",
        targetWeight: 70,
        currentWeight: 80,
        DOB: "1990-01-01",
        gender: "Male",
        sports: "Running",
        location: "New York",
        conditions: "None",
        times: "Morning",
        frequency: "Daily",
        cardio: "Yes",
        issues: "None"
    }
};

// Mock MongoDB in-memory server
beforeAll(async () => {
    await mongoose.connection.close();

    mongod = new MongoMemoryServer();
    await mongod.start();
    const mongoDBURL = await mongod.getUri();
    await mongoose.connect(mongoDBURL);
});

// Create a user before each test
beforeEach(async () => {
    const user = new UserModel(mockUser);
    await user.save();
    userId = user._id.toString();
});

// Close the in-memory server
afterAll(async () => {
    await mongoose.connection.close();
    await mongod.stop();
});

describe('UserService.deleteUserById', () => {
    it('should delete an existing user', async () => {
        const response = await UserService.deleteUserById(userId);
        expect(response.success).toBe(true);
        expect(response.code).toBe(200);

        const user = await UserModel.findById(userId);
        expect(user).toBeNull();
    });

    it('should return 404 if user does not exist', async () => {
        const nonExistentUserId = new mongoose.Types.ObjectId().toString();
        const response = await UserService.deleteUserById(nonExistentUserId);
        expect(response.success).toBe(false);
        expect(response.code).toBe(404);
        expect(response.message).toBe("User not found!");
    });

    it('should return 500 if there is an error', async () => {
        jest.spyOn(UserModel, 'findOneAndDelete').mockImplementationOnce(() => {
            throw new Error('Database error');
        });

        const response = await UserService.deleteUserById(userId);
        expect(response.success).toBe(false);
        expect(response.code).toBe(500);
        expect(response.message).toBe("Internal Server error");
    });
});