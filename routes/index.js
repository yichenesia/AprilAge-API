'use strict';

import express  from 'express';

import * as controllers from '../controllers/index.js';
import { passportAuth } from '../middleware/auth.middleware.js';

import healthCheckRoutes from './healthCheck.routes.js'; 
import userRoutes from './user.routes.js'; 
import authRoutes from './auth.routes.js'; 
import entryRoutes from './entry.routes.js'; 
import user2Routes from './user2.routes.js';

/**
 * the new Router exposed in express 4
 * the indexRouter handles all requests to the `/` path
 */
const router = express.Router();

/**
 * this accepts all request methods to the `/` path
 */
router.route('/')
  .all(passportAuth, controllers.index);

healthCheckRoutes(router);
user2Routes(router);
authRoutes(router);
userRoutes(router);
entryRoutes(router);

export default {
  router
};
