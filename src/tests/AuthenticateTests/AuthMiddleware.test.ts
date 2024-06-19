import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import AuthService from '../../app/services/AuthService';
import exp from 'constants';

describe('AuthMiddleware', () => {
    it("should return a 200 code because everything is matching", async () => {
        const userId = "123456"
        const userRole = "user"

        const token = jwt.sign({userId, userRole}, process.env.TOKEN_SECRET!, {expiresIn: '30s'});

        const {success, code, message} = await AuthService.authToken(token, userId, "user/endpoint/123456")

        expect(success).toBe(true);
        expect(code).toBe(200);
    })
    it("should return a 401 code because of the diffrent userIds", async () => {
        const userId = "123457"
        const userIdToken = "123456"
        const userRole = "user"

        const token = jwt.sign({userIdToken, userRole}, process.env.TOKEN_SECRET!, {expiresIn: '30s'});

        const {success, code, message} = await AuthService.authToken(token, userId, "user/endpoint/" + userId)

        expect(success).toBe(false);
        expect(code).toBe(401);
        expect(message).toBe("Unauthorized userIds are not matching")
    })
    it("should return a 200 code because of the admin role", async () => {
        const userId = "123457"
        const userIdToken = "123456"
        const userRole = "admin"

        const token = jwt.sign({userIdToken, userRole}, process.env.TOKEN_SECRET!, {expiresIn: '30s'});

        const {success, code, message} = await AuthService.authToken(token, userId, "user/endpoint/" + userId)

        expect(success).toBe(true);
        expect(code).toBe(200);
    })
    it("should return a 401 code because of the diffrent roles", async () => {
        const userId = "123457"
        const userIdToken = "123456"
        const userRole = "user"

        const token = jwt.sign({userIdToken, userRole}, process.env.TOKEN_SECRET!, {expiresIn: '30s'});

        const {success, code, message} = await AuthService.authRole(token, "admin/endpoint/" + userId)

        expect(success).toBe(false);
        expect(code).toBe(401);
        expect(message).toBe("Unauthorized userRole is not matching")
    })
    it("should return a 200 code of the right role", async () => {
        const userId = "123457"
        const userIdToken = "123456"
        const userRole = "admin"

        const token = jwt.sign({userIdToken, userRole}, process.env.TOKEN_SECRET!, {expiresIn: '30s'});

        const {success, code, message} = await AuthService.authRole(token, "admin/endpoint/" + userId)

        expect(success).toBe(true);
        expect(code).toBe(200);
        expect(message).toBe("Authorized")
    })
})