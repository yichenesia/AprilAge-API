'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from '../models/base.model.js';

import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js';
import userModel from '../models/user2.model.js'
import agingDocModel from '../models/agingDocument.model.js'

/*******************************************************************************
GET /users/:email/documents
*******************************************************************************/
//TODO: Figure out regex check and use filter to properly query for results
export const retrieveAgingDocs = async (req, res, next) => {
  try {
    const email = req.params.email;
    const user = await userModel.findByEmail(email);
    const pageNumber = req.body.pageNumber;
    const pageSize = req.body.pageSize
    const orderBy = req.body.orderBy;
    const filter = req.body.filter;

    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    if (connectedToApiResult && connectedToDatabaseResult) {

      const returnObj = {
        email: email, 
        pageSize: pageSize
      }

      if (parseInt(req.body.pageNumber) >= 1) {
        returnObj.pageNumber = pageNumber
      }
      if (["status", "age", "ethnicity", "gender", "name"].includes(orderBy)) {
        returnObj.orderBy = orderBy
      }

      const sql = 'SELECT agingDocument.* FROM agingDocument WHERE userID = ?';
      const result = await db.raw(sql, [user.id]).then((sqlResults) => {
        return(objectToCamelCase(sqlResults[0]));
      });
      returnObj.items = result;

      return res.json(returnObj);
    }    
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
POST /users/:email/documents
*******************************************************************************/
//TODO: have checks to make sure the variables passed in are valid
//TODO: modify return type (should return docID, not userID)
//BUG: isSample, measurement are not being added correctly in database
export const createAgingDoc = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    const email = req.params.email;

    const user = await userModel.findByEmail(email);
    
    const newDocument = {
      'userId': user.id,
      'originalImage': req.body.originalImage,
      'status': req.body.status,
      'isSample': req.body.isSample,
      'gender': req.body.gender,
      'name': req.body.name,
      'age': req.body.age,
      'ethnicity': req.body.ethnicity,
      'height': req.body.height,
      'weight': req.body.weight,
      'measurement': req.body.measurement,
      'bounds': req.body.bounds
    }

    if (connectedToApiResult && connectedToDatabaseResult) {
      const _ = await agingDocModel.create(newDocument)
      return res.json(newDocument);
    }    
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
GET /users/:email/document/results
*******************************************************************************/
//TODO: Figure out regex check and use filter to properly query for results
export const retrieveAgingResults = async (req, res, next) => {
  try {
    const email = req.params.email;
    const user = await userModel.findByEmail(email);
    const pageNumber = req.body.pageNumber;
    const pageSize = req.body.pageSize
    const orderBy = req.body.orderBy;
    const filter = req.body.filter;

    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    if (connectedToApiResult && connectedToDatabaseResult) {

      const returnObj = {
        email: email, 
        pageSize: pageSize
      }

      if (parseInt(req.body.pageNumber) >= 1) {
        returnObj.pageNumber = pageNumber
      }
      if (["status", "age", "ethnicity", "gender", "name"].includes(orderBy)) {
        returnObj.orderBy = orderBy
      }

      const sql = 'SELECT agingResult.id, status, sequenceType, sequenceID, agingDocument FROM agingDocument, agingResult WHERE agingDocument.id = agingResult.agingDocument AND agingDocument.userID = ?';
      const result = await db.raw(sql, [user.id]).then((sqlResults) => {
        return(objectToCamelCase(sqlResults[0]));
      });
      returnObj.items = result;

      return res.json(returnObj);
    }    
  } catch(err) {
    next(err);
  }
};
