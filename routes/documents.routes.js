'use strict';

import * as documents from '../controllers/documents.controller.js';

const routes = (router) => {
  router.route('/users/:email/documents')
    .get(documents.retrieveAgingDocs);

  router.route('/users/:email/documents')
    .post(documents.createAgingDoc);
  
  router.route('/users/:email/documents/results')
    .get(documents.retrieveAgingResults);
};

export default routes;
