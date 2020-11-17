'use strict';

import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js';

/*******************************************************************************
GET /status
*******************************************************************************/

export const checkApi = async (req, res, next) => {
    try {
        const connectedToApiResult = connectedToApi();
        return res.json({ connected: connectedToApiResult});
    } catch(err) {
      next(err);
    }
  };