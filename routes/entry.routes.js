'use strict';

import * as entries from '../controllers/entries.controller.js';
import { passportAuth, adminOrUserOnly } from '../middleware/auth.middleware.js';

const routes = (router) => {
  router.route('/users/:userId/entries')
    .get([passportAuth], adminOrUserOnly, entries.get)
    .post([passportAuth, adminOrUserOnly, entries.createValidation], entries.create);
  
  router.route('/users/:userId/entries/:entryId')
    .put([passportAuth, adminOrUserOnly], entries.update);
};

export default routes;