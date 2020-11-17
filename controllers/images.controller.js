'use strict';

import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js';

/*******************************************************************************
POST /images
*******************************************************************************/
export const uploadImageApi = async (req, res, next) => {
    try {
      const connectedToApiResult = connectedToApi();
      return res.json({ connected: connectedToApiResult });
    } catch(err) {
      next(err);
    }
  };