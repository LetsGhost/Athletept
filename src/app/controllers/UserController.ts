// src/controllers/userController.ts
import { Request, Response } from 'express';
import { registerUser } from '../services/UserService';

const registerUserController = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const newUser = await registerUser({ email: email as string, password: password as string });
        res.status(201).json({ message: 'User registered successfully'});
    } catch (error) {
        res.status(400).json({ message: 'Registration failed', error: error });
    }
};

export { registerUserController };
