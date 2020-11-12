'use strict';

import * as email from '../controllers/email.controller.js';

const routes = (router) => {
  router.route('/users/:email/userInfo')
    .get(email.userInfoHealthCheck);
};

export default routes;
