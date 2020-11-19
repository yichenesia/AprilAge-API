'use strict';

import * as statusRoute from '../controllers/status.controller.js';

const routes = (router) => {
    router.route('/status')
      .get(statusRoute.checkApi);
  //   router.route('/healthCheck/database')
  //     .get(healthChecks.healthCheckDatabase);
  };
  
  export default routes;