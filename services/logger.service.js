import winston from 'winston';
import moment from 'moment';

winston.emitErrs = true;

const logger = new winston.Logger({
  transports: [
    new winston.transports.Console({
      timestamp: () => {
        return (moment().format('YYYY-MM-DD HH:mm:ss'));
      },
      level: 'debug',
      handleExceptions: true,
      humanReadableUnhandledException: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: true
});

logger.stream = {
  write: (message) => {
    logger.info(message);
  }
};

export default logger;
