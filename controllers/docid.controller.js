'use strict';

import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js';

/*******************************************************************************
GET /users/:email/documents/:docid
*******************************************************************************/
export const retrieveAgingDoc = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    return res.json({ connected: connectedToApiResult });
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
DELETE /users/:email/documents/:docid
*******************************************************************************/
export const removeAgingDoc = async (req, res, next) => {
  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ connected: connectedToDatabaseResult });
  } catch(err) {
    next(err);
  }
};


/*******************************************************************************
POST /users/:email/documents/:docid/pointDetection
*******************************************************************************/
export const pointDetection = async (req, res, next) => {
  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ connected: connectedToDatabaseResult });
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
PUT /users/:email/documents/:docid/featurePoints
*******************************************************************************/
export const featurePoints = async (req, res, next) => {
  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ connected: connectedToDatabaseResult });
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
POST /users/:email/documents/:docid/match
*******************************************************************************/
export const match = async (req, res, next) => {
  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ connected: connectedToDatabaseResult });
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
POST /users/:email/documents/:docid/aging
*******************************************************************************/
export const aging = async (req, res, next) => {
  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ connected: connectedToDatabaseResult });
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
POST /users/:email/documents/:docid/detectMatchAge
*******************************************************************************/
export const detectMatchAge = async (req, res, next) => {
  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ connected: connectedToDatabaseResult });
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
GET /users/:email/documents/:docid/status
*******************************************************************************/
export const status = async (req, res, next) => {
  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ connected: connectedToDatabaseResult });
  } catch(err) {
    next(err);
  }
};