'use strict';

import { connectedToApi, connectedToDatabase } from '../models/email.model.js';

/*******************************************************************************
GET /users/:email/userInfo
*******************************************************************************/
export const retrieveUserInfo = async (req, res, next) => {
  try {
    const email = req.params.email;
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ 
        connectedToAPI: connectedToApiResult , 
        connectedToDB: connectedToDatabaseResult ,
        email: email});
  } catch(err) {
    next(err);
  }
};
