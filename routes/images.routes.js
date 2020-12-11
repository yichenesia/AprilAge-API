"use strict";

import * as imageRoutes from "../controllers/images.controller.js";
import { passportAuth } from '../middleware/auth.middleware.js';

const routes = (router) => {
  router.route("/images").post(passportAuth, imageRoutes.uploadImageApi);

  router.route("/images/:id").get(passportAuth, imageRoutes.getImageApi);
};

export default routes;
