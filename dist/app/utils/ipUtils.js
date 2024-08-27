import logger from '../../config/winstonLogger.js';
export function getClientIp(req) {
    try {
        const forwarded = req.headers['x-forwarded-for'];
        let ip = Array.isArray(forwarded) ? forwarded[0] : forwarded;
        return ip || req.socket.remoteAddress;
    }
    catch (error) {
        logger.error('Error getting client ip:', error, { service: 'getClientIp' });
    }
}
export default getClientIp;
