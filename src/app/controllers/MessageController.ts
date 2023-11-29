import { Request, Response } from 'express';
import messageService from '../services/MessageService';
import { decodeToken} from "../utils/helper";
import { decode } from 'punycode';

class MessageController {
    async createMessage(req: Request, res: Response)  {
        try {
            const { message } = req.body;
            const userId = req.params.userId;

            const decoodedToken = decodeToken(req.cookies.token)

            if(!decodeToken) {
                res.status(401).json({ success: false, message: 'You are not logged in.' });
                return;
            }

            const {success, code, messageo, newMessage} = await messageService.createMessage( message, decoodedToken.userId, userId);

            res.status(code).json({ success, message: messageo, newMessage});
        } catch (error) {
            console.error('Error creating message:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    };

    async getAllMessagesFromUser(req: Request, res: Response) {
        try {
            const userId = req.params.userId;

            const {success, code, message, messages} = await messageService.getAllMessagesFromUser(userId);

            res.status(code).json({ success, message, messages});
        } catch (error) {
            console.log('Error getting messages:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async getMessageById(req: Request, res: Response) {
        try{
            const messageId = req.params.messageId;

            const {success, code, message, messageText} = await messageService.getMessageById(messageId);

            res.status(code).json({ success, message, messageText});
        } catch (error) {
            console.error('Error getting message in MessageController.getMessageById:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async deleteMessageById(req: Request, res: Response) {
        try{
            const messageId = req.params.messageId;

            const {success, code, message} = await messageService.deleteMessageById(messageId);

            res.status(code).json({ success, message});
        } catch (error) {
            console.error('Error deleting message in MessageController.deleteMessageById:', error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}


export default new MessageController();