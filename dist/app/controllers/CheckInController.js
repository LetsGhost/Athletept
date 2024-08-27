import CheckInService from '../services/CheckInService.js'; // May need to be changed to CheckInService because the renamed file doesn't get recognized
import logger from '../../config/winstonLogger.js';
class CheckInController {
    async createCheckIn(req, res) {
        try {
            const { userId } = req.params;
            const { success, code, message, checkIn } = await CheckInService.createCheckIn(userId, req.body);
            if (success) {
                logger.info('Check-in created', { service: 'CheckInController.createCheckIn' });
            }
            res.status(code).json({ success, message, checkIn });
        }
        catch (err) {
            logger.error('Error creating check-in:', err, { service: 'CheckInController.createCheckIn' });
            res.status(500).json({ cuccess: false, message: "Internal server error" });
        }
    }
    async getCheckIn(req, res) {
        try {
            const { userId } = req.params;
            const { success, code, message, checkIn } = await CheckInService.getCheckIn(userId);
            res.status(code).json({ success, message, checkIn });
        }
        catch (err) {
            logger.error('Error getting check-in:', err, { service: 'CheckInController.getCheckIn' });
            res.status(500).json({ cuccess: false, message: "Internal server error" });
        }
    }
    async downloadCheckIn(req, res) {
        try {
            const { userId } = req.params;
            const { success, code, message, pdfBuffer, userInfo } = await CheckInService.downloadCheckIn(userId);
            if (success) {
                logger.info('Check-in downloaded', { service: 'CheckInController.downloadCheckIn' });
            }
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${userInfo?.userInfo.name}-Protokol-${new Date()}.pdf`);
            res.status(code).send(pdfBuffer);
        }
        catch (err) {
            logger.error('Error downloading check-in:', err, { service: 'CheckInController.downloadCheckIn' });
            res.status(500).json({ cuccess: false, message: "Internal server error" });
        }
    }
    async getCheckInStatus(req, res) {
        try {
            const { userId } = req.params;
            const { success, code, message, checkInStatus } = await CheckInService.getCheckInStatus(userId);
            res.status(code).json({ success, message, checkInStatus });
        }
        catch (err) {
            logger.error('Error getting check-in status:', err, { service: 'CheckInController.getCheckInStatus' });
            res.status(500).json({ cuccess: false, message: "Internal server error" });
        }
    }
}
export default new CheckInController();
