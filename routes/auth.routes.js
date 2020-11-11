'use strict';

import * as users from '../controllers/users.controller.js';
import { refreshPassportAuth } from '../middleware/auth.middleware.js';

const routes = (router) => {
  router.route('/users/reset/:resetKey')
    .put([users.resetPasswordValidation], users.resetPassword);
  router.route('/users/reset')
    .put(users.createResetKey);
  router.route('/login')
    .post([],users.logUserIn);
  router.route('/refreshAuth')
    .post([refreshPassportAuth], users.refreshAuth);
};

export default routes;
