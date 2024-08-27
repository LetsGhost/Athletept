import messageService from '../services/MessageService.js';
import logger from '../../config/winstonLogger.js';
class MessageController {
    async createMessage(req, res) {
        try {
            const { message } = req.body;
            const userId = req.params.userId;
            const { success, code, messageo, newMessage } = await messageService.createMessage(message, userId);
            if (success) {
                logger.info('Message created', { service: 'MessageController.createMessage' });
            }
            res.status(code).json({ success, message: messageo, newMessage });
        }
        catch (error) {
            logger.error('Error creating message:', error, { service: 'MessageController.createMessage' });
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    ;
    async getAllMessagesFromUser(req, res) {
        try {
            const userId = req.params.userId;
            const { success, code, message, messages } = await messageService.getAllMessagesFromUser(userId);
            res.status(code).json({ success, message, messages });
        }
        catch (error) {
            logger.error('Error getting all messages from user:', error, { service: 'MessageController.getAllMessagesFromUser' });
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    async getMessageById(req, res) {
        try {
            const messageId = req.params.messageId;
            const { success, code, message, messageText } = await messageService.getMessageById(messageId);
            res.status(code).json({ success, message, messageText });
        }
        catch (error) {
            logger.error('Error getting message by id:', error, { service: 'MessageController.getMessageById' });
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
    async deleteMessageById(req, res) {
        try {
            const messageId = req.params.messageId;
            const { success, code, message } = await messageService.deleteMessageById(messageId);
            if (success) {
                logger.info('Message deleted', { service: 'MessageController.deleteMessageById' });
            }
            res.status(code).json({ success, message });
        }
        catch (error) {
            logger.error('Error deleting message by id:', error, { service: 'MessageController.deleteMessageById' });
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}
export default new MessageController();
