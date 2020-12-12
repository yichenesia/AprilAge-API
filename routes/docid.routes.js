'use strict';

import * as docid from '../controllers/docid.controller.js';
import { passportAuth } from '../middleware/auth.middleware.js';

const routes = (router) => {
  router.route('/users/:email/documents/:docID')
    .get(passportAuth, docid.retrieveAgingDoc);
  router.route('/users/:email/documents/:docID')
    .delete(passportAuth, docid.removeAgingDoc);
  router.route('/users/:email/documents/:docID/points')
    .get(passportAuth, docid.points);
  router.route('/users/:email/documents/:docID/aging')
    .post(passportAuth, docid.aging);
  router.route('/users/:email/documents/:docID/status')
    .get(passportAuth, docid.status);
};

export default routes;
