'use strict';

import { connectedToApi, connectedToDatabase } from '../models/user2.model.js';

/*******************************************************************************
GET /users
*******************************************************************************/
export const users = async (req, res, next) => {
try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    //TODO: Add list of users from database
    return res.json({ 
        connectedToAPI: connectedToApiResult , 
        connectedToDB: connectedToDatabaseResult
    });
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
    const username = req.query.username;
    const password = req.query.password;
    const age = req.query.age;
    //TODO: Add more inputs later
    //TODO: Create entry in db
    return res.json({ 
        connected: connectedToDatabaseResult , 
        connectedToDB: connectedToDatabaseResult,
        username: username,
        password: password,
        age: age });
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
        const username = req.query.username;
        //TODO: Get user info from db
        return res.json({ 
            connectedToAPI: connectedToApiResult , 
            connectedToDB: connectedToDatabaseResult,
            username: username
        });
        } catch(err) {
        next(err);
        }
    };
