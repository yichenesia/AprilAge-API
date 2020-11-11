'use strict';

import path from 'path';
import minimist from 'minimist';
import dotEnv from 'dotenv';

import { getDirname} from '../utils/require.utils.js';

dotEnv.config();

const __dirname = getDirname(import.meta.url); // path.dirname(__filename);
const rootPath = path.join(__dirname + '/..');

const argV = minimist(process.argv.slice(2));

const getEnv = (envName) => {
  const configPrefix = argV.configprefix ? argV.configprefix : '';

  const fullEnvName = configPrefix + envName;
  return process.env[fullEnvName];
}; 

const config = {
  domain: getEnv('API_DOMAIN'),
  api: {
    name: 'APP'
  },
  api_root_path: getEnv('API_ROOT'),
  root: rootPath,
  port: getEnv('API_SERVER_PORT'),
  database: {
    debugSQL: false,
    client:'mysql',
    connection: {
      host: getEnv('API_MYSQL_HOST'),
      port: getEnv('API_MYSQL_PORT'),
      user: getEnv('API_MYSQL_USER'),
      password: getEnv('API_MYSQL_PASSWORD'),
      database: getEnv('API_MYSQL_DATABASE'),
      charset: 'utf8'
    }
  },
  crypto: {
    hashByteSize: 64,
    saltByteSize: 16,
    iterations: 74914
  },
  // The secret should be set to a non-guessable string that
  // is used to compute a session hash
  jwt:{
    sessionSecret: getEnv('API_SESSION_SECRET'),
    refreshSessionSecret: getEnv('API_REFRESH_SESSION_SECRET'),
    jWTExpires: getEnv('API_JWT_EXPIRY') ? getEnv('API_JWT_EXPIRY') : '60m',
    refreshExpires: getEnv('API_REFRESH_EXPIRY') ? getEnv('API_REFRESH_EXPIRY') : '7d',
    refreshRefreshOnUse: getEnv('API_REFRESH_REFRESH_JWT_ON_USE') ? parseInt(getEnv('API_REFRESH_REFRESH_JWT_ON_USE')) : 0 // whether to refresh refresh tokens on use
  },
  accessControlAllowOrigin: getEnv('API_CORS_ALLOW_ORIGIN')
};

export default config;
