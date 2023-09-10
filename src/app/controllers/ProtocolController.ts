import {Request, Response} from "express";
import {createProtocol, getProtocol} from "../services/ProtocolService";

export const createProtocolController = async (req: Request, res: Response) => {
    try {
        const { userId, protocol, comment } = req.body;

        const newProtocol = await createProtocol(userId, protocol, comment);

        res.status(201).json({message: "Protocol got created", newProtocol});
    } catch (error) {
        console.error('Error creating ProtocolExercisePlan:', error);
        res.status(500).json({ message: 'Error creating ProtocolExercisePlan', error: error });
    }
}

export const getProtocolController = async (req: Request, res: Response) => {
    try{
        const { userId } = req.params;

        const protocol = await getProtocol(userId);

        res.status(200).json({message: "Protocol got fetched", protocol});
    }
    catch(error){
        console.error('Error getting ProtocolExercisePlan:', error);
        res.status(500).json({ message: 'Error getting ProtocolExercisePlan', error: error });
    }
}