import weekDisplay from '../app/services/WeekDisplayService';
import UserModel from '../app/models/UserModel';
import { WeekDisplay } from '../app/models/WeekDisplayModel';
jest.mock('../app/models/UserModel');
jest.mock('../app/models/WeekDisplayModel');
describe('WeekDisplayService', () => {
    it('should create a week display', async () => {
        const mockUser = {
            _id: 'userId1',
            save: jest.fn().mockResolvedValue(true),
        };
        const mockWeekDisplay = {
            _id: 'weekDisplayId1',
            save: jest.fn().mockResolvedValue(true),
        };
        UserModel.findById = jest.fn().mockResolvedValue(mockUser);
        WeekDisplay.create = jest.fn().mockResolvedValue(mockWeekDisplay);
        const userId = 'userId1';
        const trainingsWeek = ['training1', 'training2', 'training3'];
        const result = await weekDisplay.createWeekDisplay(userId, trainingsWeek);
        expect(UserModel.findById).toHaveBeenCalledWith(userId);
        expect(WeekDisplay.create).toHaveBeenCalledWith({
            trainingsWeek,
        });
        expect(mockUser.save).toHaveBeenCalled();
        expect(result).toEqual({
            success: true,
            code: 201,
            weekDisplay: mockWeekDisplay,
        });
    });
});
