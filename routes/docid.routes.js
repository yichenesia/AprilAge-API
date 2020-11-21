'use strict';

import * as docid from '../controllers/docid.controller.js';

const routes = (router) => {
  router.route('/users/:email/documents/:docID')
    .get(docid.retrieveAgingDoc);
  router.route('/users/:email/documents/:docID')
    .delete(docid.removeAgingDoc);
  router.route('/users/:email/documents/:docID/points')
    .get(docid.points);
  router.route('/users/:email/documents/:docID/aging')
    .post(docid.aging);
  router.route('/users/:email/documents/:docID/status')
    .get(docid.status);
};

export default routes;
