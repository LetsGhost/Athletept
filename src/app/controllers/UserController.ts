import { Request, Response } from "express";
import {getUserById} from "../services/UserService";

export const getUserByIdController = async (req: Request,res: Response ) => {
    try {
        const { userId } = req.params;

        const user = await getUserById(userId);
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error });
    }
}