'use strict';

import * as healthChecks from '../controllers/healthChecks.controller.js';

const routes = (router) => {
  router.route('/healthCheck/api')
    .get(healthChecks.healthCheckApi);
  router.route('/healthCheck/database')
    .get(healthChecks.healthCheckDatabase);
};

export default routes;
