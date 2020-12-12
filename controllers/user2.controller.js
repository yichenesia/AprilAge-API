'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from '../models/base.model.js';

 import { connectedToApi, connectedToDatabase } from '../models/status.model.js';
 import userModel from "../models/user2.model.js";

/*******************************************************************************
GET /users
Gets the email and id of all users in the database
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
    else{
      //Error message for when the api or database connection isn't working
      res.status(500).send("Error 500: Internal Error");
    }
  }
  catch(err) {
    next(err);
  }
};

/*******************************************************************************
POST /create_user
Creates a new user with the inputs -> email, firstname, lastname, password
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
      const hashed_password = req.query.hashed_password;
      const userObj ={email, first_name, last_name, hashed_password};
      const user = await userModel.findByEmail(email);

      // Check if valid email
      var re = /\S+@\S+\.\S+/;

      if(!re.test(email)){
        // Invalid email adress
        res.status(400).send('Error 400: Invalid email address');
        return;
      }else if (user) {
        //User already exists
        res.status(400).send('Error 400: User with this email already exists');
        return;
      }
      else if (connectedToApiResult && connectedToDatabaseResult) {
          const user = await userModel.create(userObj);
    
          res.status(201).send('User created');
      }
      else{
        //Error message for when the api or database connection isn't working
        res.status(500).send("Error 500: Internal Error");
      }
    } 
    catch(err) {
      next(err);
    }
};

/*******************************************************************************
GET /user_info
Gets all user info of the user that matches the inputted email
*******************************************************************************/
export const user_info = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    const email = req.query.email;
    const user = await userModel.findByEmail(email);
    
    if (!user) {
      res.status(404).send('Error 404: User not found');
      return;
    }
    else if (connectedToApiResult && connectedToDatabaseResult) {
        const user = await userModel.findByEmail(email);
  
        return res.json({ 
            user: user
        });
    }
    else{
      //Error message for when the api or database connection isn't working
      res.status(500).send("Error 500: Internal Error");
    }
  } 
  catch(err) {
    next(err);
  }
};