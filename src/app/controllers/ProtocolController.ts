import {Request, Response} from "express";
import protocolService from "../services/ProtocolService";

class ProtocolController{
    async createProtocol(req: Request, res: Response) {
        try {
            const { userId, protocol, comment } = req.body;

            const newProtocol = await protocolService.createProtocol(userId, protocol, comment);

            res.status(201).json({message: "Protocol got created", newProtocol});
        } catch (error) {
            console.error('Error creating ProtocolExercisePlan:', error);
            res.status(500).json({ message: 'Error creating ProtocolExercisePlan', error: error });
        }
    }

    async getProtocol(req: Request, res: Response) {
        try{
            const { userId } = req.params;

            const protocol = await protocolService.getProtocol(userId);

            res.status(200).json({message: "Protocol got fetched", protocol});
        }
        catch(error){
            console.error('Error getting ProtocolExercisePlan:', error);
            res.status(500).json({ message: 'Error getting ProtocolExercisePlan', error: error });
        }
    }
}

export default new ProtocolController();