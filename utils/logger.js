const winston = require('winston');
const { combine, timestamp, printf, colorize, align } = winston.format;

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    colorize({ all: true }),
    timestamp({
      format: 'YYYY-MM-DD hh:mm:ss.SSS A',
    }),
    align(),
    printf((info) => `[${info.timestamp}] ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.Console(),
  ],
});

process.on('unhandledRejection', (ex) => {
  logger.error(`UNHANDLED REJECTION: ${ex.message}`, ex);
  process.exit(1);
});

process.on('uncaughtException', (ex) => {
  logger.error(`UNCAUGHT EXCEPTION: ${ex.message}`, ex);
  process.exit(1);
});

module.exports = logger;