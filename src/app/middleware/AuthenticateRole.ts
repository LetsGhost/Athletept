import {NextFunction, Request, Response} from "express";
import jwt, {JwtPayload} from "jsonwebtoken";

interface CustomJwtPayload extends JwtPayload{
    userId: string;
    userRole: string;
}

class AuthenticateRole {
    authenticateRole(req: Request, res: Response, next: NextFunction) {
        const token = req.cookies.token;

        if (!token) {
            console.log('Token not provided');
            return res.status(401).json({ message: 'Token not provided' });
        }

        try {
            const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET!) as CustomJwtPayload;

            if(decodedToken.userRole !== 'admin') {
                console.log('Invalid role');
                return res.status(401).json({ message: 'Invalid role' });
            }

            next();
        } catch (error) {
            console.log('Invalid token', error);
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
}

export default new AuthenticateRole();