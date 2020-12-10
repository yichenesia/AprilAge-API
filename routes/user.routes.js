'use strict';

import connectNoCache from 'connect-nocache';

import * as users from '../controllers/users.controller.js';
import { passportAuth } from '../middleware/auth.middleware.js';

const noCache = connectNoCache();

const routes = (router) => {
  router.route('/users/:userId/password')
    .put([passportAuth, users.updatePasswordValidation], users.updatePassword);
  router.route('/users/me')
    .get(passportAuth, noCache, users.me);
  router.route('/users/:userId')
    .put(passportAuth, users.update);
  router.route('/createuser')
    .post([users.createValidation], users.create);

  router.route('/users')
    .get(passportAuth, users.users);
  router.route('/userinfo')
    .get(passportAuth, users.user_info);
};

export default routes;
