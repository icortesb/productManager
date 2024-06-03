import winston from 'winston';
import { environment } from '../config/commander.config.js';
const customLevelOptions = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'red',
        warning: 'yellow',
        info: 'green',
        http: 'magenta',
        debug: 'blue'
    }
}

winston.addColors(customLevelOptions.colors);

const productionLogger = winston.createLogger({
    level: 'info',
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.timestamp({format: 'YYYY-MM-DD HH:mm:ss'}),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({filename: 'logs/error.log', level: 'error'}),
        new winston.transports.File({filename: 'logs/combined.log'})
    ]
});

const developmentLogger = winston.createLogger({
    level: 'debug',
    levels: customLevelOptions.levels,
    format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
    ),
    transports: [
        new winston.transports.Console()
    ]
});

export const addLogger = (req, res, next) => {
    const logger = environment === 'development' ? developmentLogger : productionLogger;
    req.logger = logger;
    req.logger.info(`Request method: ${req.method}, Request URL: ${req.originalUrl} at ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}`);
    next();
}