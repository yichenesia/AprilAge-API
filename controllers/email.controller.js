'use strict';

import _ from 'lodash';
import { connectedToApi, connectedToDatabase } from '../models/status.model.js';
import userModel from "../models/user.model.js";
import agingDocModel from "../models/agingDocument.model.js";
import config from "../config/config.js";

/*******************************************************************************
GET /users/:email/userInfo
*******************************************************************************/
export const retrieveUserInfo = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    if (connectedToApiResult && connectedToDatabaseResult) {
      const email = req.params.email;
      const user = await userModel.findByEmail(email);
      // since there are no roles, there is no 401 case
      if (!user) {
        res.status(404);
        res.send('User not found');
        return;
      }
      
      const result = await agingDocModel.findNumAgings(user.id);

      return res.json({
        uri: config.domain + "/" + email,
        email: email,
        tokens: 0,
        numAgingResults: result.numAgingResults,
        role: "user"
      });
    }
  } catch(err) {
    next(err);
  }
};
