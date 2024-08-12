
const winston = require('winston')

const enumerateErrorFormat = winston.format((info: Error) => {
    if (info?.stack) Object.assign(info, { message: info.stack });
    return info;
});

const logger = winston.createLogger({
    level: process.env.NODE_ENVIRONMENT === 'development' ? 'debug' : 'info',  
    format: winston.format.combine(
        enumerateErrorFormat(),
        process.env.NODE_ENVIRONMENT === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
        winston.format.splat(),
        winston.format.printf((params: {level: string, message: string}) => `${params.level}: ${params.message}`)
    ),
    transports: [
        new winston.transports.Console(),
    ],
});


export default logger;