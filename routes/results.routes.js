'use strict';

import * as results from '../controllers/results.controller.js';
import { passportAuth } from '../middleware/auth.middleware.js';

const routes = (router) => {
  router.route('/users/:email/documents/:docID/results')
    .get(passportAuth, results.getResults);
};

export default routes;