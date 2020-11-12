'use strict';

import { connectedToApi, connectedToDatabase } from '../models/email.model.js';

/*******************************************************************************
GET /users/:email/userInfo
*******************************************************************************/
export const userInfoHealthCheck = async (req, res, next) => {
  try {
    const email = req.params.email;
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ 
        connectedToAPI: connectedToApiResult , 
        email: email ,
        connectedToDB: connectedToDatabaseResult});
  } catch(err) {
    next(err);
  }
};
