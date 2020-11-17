'use strict';

import * as imageRoutes from '../controllers/images.controller.js';

const routes = (router) => {
  router.route('/images')
    .post(imageRoutes.uploadImageApi);
//   router.route('/healthCheck/database')
//     .get(healthChecks.healthCheckDatabase);
};

export default routes;
