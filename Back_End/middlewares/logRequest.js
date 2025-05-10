const logger = require('../config/logger');

const logRequest = (req, res, next) => {
    const { method, url } = req;
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    res.on('finish', () => {
        const status = res.statusCode;
        logger.info(`${method} ${url} - ${status} - IP: ${ip}`);
    });

    next();
};

module.exports = logRequest;