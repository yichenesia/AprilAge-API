'use strict';

import * as results from '../controllers/results.controller.js';

const routes = (router) => {
  router.route('/users/:email/documents/:docID/results')
    .get(results.getResults);
};

export default routes;