'use strict';

import { connectedToApi, connectedToDatabase } from '../models/documents.model.js';

/*******************************************************************************
GET /users/:email/documents
*******************************************************************************/
export const retrieveAgingDocs = async (req, res, next) => {
  try {
    const email = req.params.email;
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ 
        connectedToAPI: connectedToApiResult , 
        connectedToDB: connectedToDatabaseResult,
        email: email ,
        status: 'retreive user\'s aging documents'
    });
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
