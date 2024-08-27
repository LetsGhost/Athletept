import { createLogger, format, transports } from 'winston';
const customFormat = format.printf(({ level, message, timestamp, service }) => {
    return `["service":"${service}","timestamp":"${timestamp}"]${level}: ${message}`;
});
const logger = createLogger({
    level: 'info',
    format: format.combine(format.colorize(), format.timestamp({
        format: 'DD-MM-YYYY HH:mm:ss'
    }), format.errors({ stack: true }), format.splat(), customFormat),
    defaultMeta: { service: 'AthletePT' },
    transports: [
        new transports.Console()
    ]
});
export default logger;
