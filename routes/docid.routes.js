'use strict';

import * as docid from '../controllers/docid.controller.js';

const routes = (router) => {
  router.route('/users/:email/documents/:docid')
    .get(docid.retrieveAgingDoc);
  router.route('/users/:email/documents/:docid')
    .delete(docid.removeAgingDoc);
  router.route('/users/:email/documents/:docid/points')
    .get(docid.points);
  router.route('/users/:email/documents/:docid/aging')
    .post(docid.aging);
  router.route('/users/:email/documents/:docid/status')
    .get(docid.status);
};

export default routes;
