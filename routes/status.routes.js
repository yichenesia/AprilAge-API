'use strict';

import * as statusRoute from '../controllers/status.controller.js';

const routes = (router) => {
    router.route('/status/api')
      .get(statusRoute.checkApi);

    router.route('/status/database').get(statusRoute.checkDB); 
  };
  
  export default routes;