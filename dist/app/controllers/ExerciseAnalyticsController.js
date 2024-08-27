import ExerciseAnalyticsService from '../services/ExerciseAnalyticsService.js';
import logger from '../../config/winstonLogger.js';
class ExerciseAnalyticsController {
    async getTopExercises(req, res) {
        try {
            const { userId } = req.params;
            const { success, code, topExercises } = await ExerciseAnalyticsService.getTopExercises(userId);
            res.status(code).json({ success, topExercises });
        }
        catch (error) {
            logger.error('Error getting top exercises:', error, { service: 'ExerciseAnalyticsController.getTopExercises' });
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
    async getExerciseRanking(req, res) {
        try {
            const { userId } = req.params;
            const { success, code, message, exerciseRanking } = await ExerciseAnalyticsService.getExerciseRanking(userId);
            res.status(code).json({ success, message, exerciseRanking });
        }
        catch (error) {
            logger.error('Error getting exercise ranking:', error, { service: 'ExerciseAnalyticsController.getExerciseRanking' });
            res.status(500).json({ success: false, message: "Internal Server error" });
        }
    }
}
export default new ExerciseAnalyticsController();
