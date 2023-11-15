import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import UserModel  from '../app/models/UserModel'; // adjust import as needed
import { WeekDisplay } from '../app/models/WeekDisplayModel'; // adjust import as needed
import weekDisplayService from '../app/services/WeekDisplayService'; // adjust import as needed

// To test indivudal files npm run test:file -- path/to/your/testfile.ts

describe('createWeekDisplay', () => {
  let mongoServer: MongoMemoryServer;

  beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should create a week display for a user', async () => {
    const user = new UserModel({ /* user data */ });
    await user.save();

    const trainingsWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const result = await weekDisplayService.createWeekDisplay(user._id, trainingsWeek);

    expect(result.success).toBe(true);
    expect(result.code).toBe(201);
    expect(result.weekDisplay).toBeDefined();

    const updatedUser = await UserModel.findById(user._id).populate('weekDisplay');
    if (updatedUser) {
        expect(updatedUser.weekDisplay).toBeDefined();
    } else {
        throw new Error('User not found');
    }
  });

  it('should return an error if the user does not exist', async () => {
    const result = await weekDisplayService.createWeekDisplay('nonexistentid', []);

    expect(result.success).toBe(false);
    expect(result.code).toBe(404);
  });
});