'use strict';

import * as healthChecks from '../controllers/results.controller.js';

const routes = (router) => {
  router.route('/users/:email/documents/:docID/results')
    .get(healthChecks.healthCheckApi);
  router.route('/users/:email/documents/:docID/results/database')
    .get(healthChecks.healthCheckDatabase);
};

export default routes;