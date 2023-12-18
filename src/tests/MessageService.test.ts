import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import MessageService from '../../dist/app/services/MessageService';

let mongod: any;

beforeAll(async () => {
  mongod = new MongoMemoryServer();
  const mongoDBURL = await mongod?.getUri();
  await mongoose.connect(mongoDBURL);
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
            const userId = '123456789';

            // Act
            const result = await MessageService.createMessage(message, userId);

            // Assert
            expect(result.success).toBe(true);
        });
    });
});


// Now you can write your tests here