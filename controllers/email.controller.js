'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from '../models/base.model.js';

import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js';
import userModel from "../models/user.model.js";

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
      
      const userid = user.id;

      const sql = 'SELECT COUNT(*) numAgingResults FROM agingDocument, agingResult WHERE agingDocument.id = agingResult.agingDocument AND agingDocument.userID = ?';

      const result = await db.raw(sql, [userid]).then((sqlResults) => {
        return(objectToCamelCase(sqlResults[0][0]));
      });

      return res.json({
        uri: "http://ageme.com/AprilAPI/users/" + email,
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
