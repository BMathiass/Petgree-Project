const { createLogger, format, transports } = require('winston');
const path = require('path');
const fs = require('fs');

const isProduction = process.env.NODE_ENV === 'production';

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

const logger = createLogger({
    level: 'info',
    format: format.combine(
        ...(!isProduction ? [format.colorize()] : []), // Correção aplicada
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(),
        ...(isProduction ? [
            new transports.File({ filename: path.join(logDir, 'app.log') }),
            new transports.File({ filename: path.join(logDir, 'errors.log'), level: 'error' })
        ] : [])
    ],
    exceptionHandlers: isProduction ? [
        new transports.File({ filename: path.join(logDir, 'exceptions.log') })
    ] : [],
    rejectionHandlers: isProduction ? [
        new transports.File({ filename: path.join(logDir, 'rejections.log') })
    ] : [],
    exitOnError: isProduction 
});

module.exports = logger;