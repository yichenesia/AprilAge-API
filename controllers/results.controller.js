'use strict';

import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js'; // change model later

/*******************************************************************************
GET /healthCheck/api
*******************************************************************************/
export const healthCheckApi = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    return res.json({ connected: connectedToApiResult });
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
GET /healthCheck/database
*******************************************************************************/
export const healthCheckDatabase = async (req, res, next) => {
  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ connected: connectedToDatabaseResult });
  } catch(err) {
    next(err);
  }
};