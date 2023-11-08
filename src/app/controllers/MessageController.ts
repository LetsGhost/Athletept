import { Request, Response } from 'express';
import messageService from '../services/MessageService';
import { decodeToken} from "../utils/helper";

class MessageController {
    async createMessage(req: Request, res: Response)  {
        try {
            const { message } = req.body;
            const userId = req.params.userId;

            const decoodedToken = decodeToken(req.cookies.token)

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
}


export default new MessageController();