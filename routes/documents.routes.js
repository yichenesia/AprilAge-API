'use strict';

import * as documents from '../controllers/documents.controller.js';
import { passportAuth } from '../middleware/auth.middleware.js';

const routes = (router) => {
  router.route('/users/:email/documents')
    .get(passportAuth, documents.retrieveAgingDocs);

  router.route('/users/:email/documents')
    .post(passportAuth, documents.createAgingDoc);
  
  router.route('/users/:email/document/results')
    .get(passportAuth, documents.retrieveAgingResults);
};

export default routes;
