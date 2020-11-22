"use strict";

import * as imageRoutes from "../controllers/images.controller.js";

const routes = (router) => {
  router.route("/images").post(imageRoutes.uploadImageApi);

  router.route("/images/:id").get(imageRoutes.getImageApi);
};

export default routes;
