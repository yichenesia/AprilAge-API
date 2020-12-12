'use strict';

import * as email from '../controllers/email.controller.js';
import { passportAuth } from '../middleware/auth.middleware.js';

const routes = (router) => {
  router.route('/users/:email/userInfo')
    .get(passportAuth, email.retrieveUserInfo);
};

export default routes;
