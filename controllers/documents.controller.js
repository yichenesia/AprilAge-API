'use strict';

import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js';

/*******************************************************************************
GET /users/:email/documents
*******************************************************************************/
//TODO: Figure out regex check and use filter to properly query for results
export const retrieveAgingDocs = async (req, res, next) => {
  try {
    const email = req.params.email;
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

      return res.json(returnObj);
    }    
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
POST /users/:email/documents
*******************************************************************************/
export const createAgingDoc = async (req, res, next) => {
  try {
    const email = req.params.email;
    const newDocument = { 
      'imageID': req.body.imageID,
      'imageURI': req.body.imageURI,
      'detectPoints': req.body.detectPoints,
      'document': req.body.document
    }
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ 
        connectedToAPI: connectedToApiResult , 
        connectedToDB: connectedToDatabaseResult,
        email: email ,
        newDocument: newDocument,
        status: 'create an aging document'
    });
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
GET /users/:email/documents/results
*******************************************************************************/
export const retrieveAgingResults = async (req, res, next) => {
  try {
    const email = req.params.email;

    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ 
        connectedToAPI: connectedToApiResult , 
        connectedToDB: connectedToDatabaseResult,
        email: email ,
        status: 'retrieve all aging results for user'
    });
  } catch(err) {
    next(err);
  }
};
