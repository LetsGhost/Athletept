import logger from '../../config/winstonLogger.js';
import getClientIp from '../utils/ipUtils.js';
import AuthService from '../services/AuthService.js';
class AuthenticateToken {
    async authenticateToken(req, res, next) {
        try {
            const token = req.cookies.token;
            if (!token) {
                logger.warn('User tried to access user Endpoints without an Token: ' + " at " + req.path + " " + getClientIp(req), { service: 'AuthenticateToken.authenticateToken' });
                return res.status(401).json({ success: false, message: 'Unauthorized' });
            }
            await AuthService.authToken(token, req.path).then(({ success, code, message }) => {
                if (!success) {
                    logger.warn('User tried to access user Endpoints with an invalid userId: ' + getClientIp(req) + " at " + req.path, { service: 'AuthenticateToken.authenticateToken' });
                    return res.status(code).json({ success: false, message: message });
                }
                else {
                    next();
                }
            });
        }
        catch (error) {
            logger.error('Error authenticating token:', error, { service: 'AuthenticateToken.authenticateToken' });
            return res.status(401).json({ message: 'Invalid token' });
        }
    }
    ;
}
export default new AuthenticateToken();
