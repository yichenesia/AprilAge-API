'use strict';

/**
 * Module dependencies.
 */
import config from './config/config.js';
import morgan from 'morgan';
import  bodyParser from 'body-parser';
import  compress from 'compression';
import  corsMiddleware from './middleware/cors.middleware.js';
import  passport from 'passport';
import  moment from 'moment';
import  routes from './routes/index.js';
import  * as cacheService from './services/cache.service.js';
import  * as jwtService from './services/jwt.service.js';
import  logger from './services/logger.service.js';
import sqsMonitor from './services/sqsMonitor.js';
import configPassport from './config/passport.js';

const runApp = (app) => {

  morgan.token('api_timestamp', () => { return moment().format('DD MMM HH:mm:ss'); });
  morgan.token('response-time', (req, res) => {
    if (!req._startAt || !res._startAt) {
      // missing request and/or response start time
      return;
    }

    // calculate diff
    const ms = (res._startAt[0] - req._startAt[0]) * 1e3
      + (res._startAt[1] - req._startAt[1]) * 1e-6;

    // return truncated value
    return ms.toFixed(0);
  });

// Set the node enviornment variable if not set before
  process.env.NODE_ENV = process.env.NODE_ENV || 'local';

  configPassport(passport);

  app.use(corsMiddleware);
  app.set('title', config.api.title);
  app.disable('x-powered-by');
  app.disable('query parser');
  app.disable('trust proxy'); // CORS
  app.set('etag', false);
  app.enable('strict routing');
  app.set('showStackError', true);
  app.enable('jsonp callback');
  app.use(compress());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  if (process.env.NODE_ENV === 'development') {
    app.set('json spaces', 4);
    app.use(morgan(':api_timestamp :remote-addr - :method :url HTTP/:http-version :status :res[content-length] bytes - :response-time ms'));
  } else {
    app.use(morgan(':api_timestamp :req[x-forwarded-for] - :method :url HTTP/:http-version :status :res[content-length] bytes - :response-time ms'));
  }

  app.use(passport.initialize());

  // routes
  app.get('/favicon.ico', (req, res)=> {
    res.sendStatus(200);
  });

  app.use(config.api_root_path, routes.router);

  // 404 - Not Found
  app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // 500 - Internal Server Error
  app.use((err, req, res) => {
    const code = err.status || 500;
    if (code !== 404) {
      logger.error(err.stack);
    }
    res.status(code);
    if (process.env.NODE_ENV === 'development') {
      res.json({ message: err.message, error: err });
    } else {
      res.json({ message: err.message});
    }
  });

  process.on('uncaughtException',  (err) => {
    logger.error('UNCAUGHT EXCEPTION: Terminating ...');
    if (err.code === 'EADDRINUSE') {
      logger.error('Failed to bind port. Terminating ...');
    } else {
      logger.error(err.message, '\n', err);
    }
    process.exit(1);
  });

  // errors won't be silently swallowed when someone forgets to add a catch call to a Promise chain
  // @see: https://gist.github.com/benjamingr/0237932cee84712951a2
  process.on('unhandledRejection', (error, p) => {
    logger.error('Possibly Unhandled Rejection at: Promise ', p);
    if(error) {
      logger.error('STACK: ' + error.stack);
    }
  });

  // Start the app by listening on <port>
  const port = process.env.PORT || config.port;


  logger.info('*********************************************************************************************');
  logger.info('Starting %s API Server ...', config.api.name);
  logger.info('Server Date/Time: %s', Date(Date.now()));

  setInterval(() => checkMessage(sqsMonitor), 3000); //Check for messages from SQS

  //Setup services
  const servicesPromises = [
    cacheService.init(config.cache),
    jwtService.init(config.jwt)
  ];

  return Promise.all(servicesPromises).then(() => {
    logger.info('All services initialized');

    return {
      port,
      logger,
      config
    }; 
  });
};

function checkMessage(sqsMonitor) {
  sqsMonitor();
};

export default runApp;
