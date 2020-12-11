'use strict';

import { connectedToApi, connectedToDatabase } from '../models/status.model.js';

/*******************************************************************************
GET /status
*******************************************************************************/

export const checkApi = async (req, res, next) => {
    try {
        const connectedToApiResult = await connectedToApi();
        return res.json({ connected: connectedToApiResult});
    } catch(err) {
      next(err);
    }
  };

export const checkDB = async(req, res, next) => {

  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({connected: connectedToDatabaseResult})
  } catch(err) {
    next(err); 
  }

}