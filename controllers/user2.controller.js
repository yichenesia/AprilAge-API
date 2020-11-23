 'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from '../models/base.model.js';

 import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js';
 import userModel from "../models/user2.model.js";

/*******************************************************************************
GET /users
*******************************************************************************/
export const users = async (req, res, next) => {
try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    
    if (connectedToApiResult && connectedToDatabaseResult) {

      const sql = 'SELECT email FROM users';

      const result = await db.raw(sql, []).then((sqlResults) => {
        return(objectToCamelCase(sqlResults[0]));
      });

      return res.json({
        users: result
      });
    }

    } catch(err) {
    next(err);
    }
};

/*******************************************************************************
POST /create_user
*******************************************************************************/
export const create_user = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();

    //Inputs
    //const role = req.query.role;
    const email = req.query.email;
    const first_name = req.query.first_name;
    const last_name = req.query.last_name;
    //const salt = req.query.salt;
    //const hashed_password = req.query.hashed_password;
    const userObj ={email, first_name, last_name};
    //TODO: Add more inputs later
    //TODO: Create entry in db

    if (connectedToApiResult && connectedToDatabaseResult) {
        const user = await userModel.create(userObj);
  
        return res.json({ 
            message: 'User created'});
      }
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
GET /user_info
*******************************************************************************/
export const user_info = async (req, res, next) => {
    try {
        const connectedToApiResult = connectedToApi();
        const connectedToDatabaseResult = await connectedToDatabase();
        const email = req.query.email;
        //TODO: Get user info from db

        if (connectedToApiResult && connectedToDatabaseResult) {
            const user = await userModel.findByEmail(email);
      
            return res.json({ 
                connectedToAPI: connectedToApiResult , 
                connectedToDB: connectedToDatabaseResult,
                email: email,
                user: user
            });
          }
        } catch(err) {
        next(err);
        }
    };