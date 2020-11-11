import config from '../config/config.js';
import cors from 'cors';
import _ from 'lodash';

//cors middleware
const whitelist = _.map(config.accessControlAllowOrigin.split(','),(whiteListedUri) => {
  return whiteListedUri.trim();
});

const originWhiteListCheck = (origin, callback) => {
  const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
  callback(null, originIsWhitelisted);
};

const corsOptions = {
  origin: originWhiteListCheck,
  methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization','Content-Length','X-Request-With'],
  credentials: true
};

const corsMiddleware = cors(corsOptions);

export default corsMiddleware;
