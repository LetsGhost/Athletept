import logger from "../../config/winstonLogger.js";
import getClientIp from "../utils/ipUtils.js";
import AuthService from "../services/AuthService.js";
class AuthenticateRole {
    async authenticateRole(req, res, next) {
        try {
            const token = req.cookies.token;
            if (!token) {
                logger.warn('User tried to access admin Endpoints: ' + getClientIp(req) + " at " + req.path, { service: 'AuthenticateRole.authenticateRole' });
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            await AuthService.authRole(token, req.path).then(({ success, code, message }) => {
                if (!success) {
                    logger.warn('User tried to access admin Endpoints with an invalid Role: ' + getClientIp(req) + " at " + req.path, { service: 'AuthenticateRole.authenticateRole' });
                    return res.status(code).json({ success: false, message: message });
                }
                else {
                    next();
                }
            });
        }
        catch (error) {
            logger.error('Error authenticating role:', error, { service: 'AuthenticateRole.authenticateRole' });
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    }
}
export default new AuthenticateRole();
