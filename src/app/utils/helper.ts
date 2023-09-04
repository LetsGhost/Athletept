import jwt from "jsonwebtoken";

export function decodeToken(token: string) {
    return jwt.decode(token) as { userId: string, userRole: string };
}