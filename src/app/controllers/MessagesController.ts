import { Request, Response } from 'express';
import * as messageService from '../services/MessageService';
import { decodeToken} from "../utils/helper";

export const createMessageController = async (req: Request, res: Response) => {
    try {
        const { message } = req.body;
        const userId = req.params.userId;

        const decoodedToken = decodeToken(req.cookies.token)

        const newMessage = await messageService.createMessage( message, decoodedToken.userId, userId);

        res.status(201).json(newMessage);
    } catch (error) {
        console.error('Error creating message:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
