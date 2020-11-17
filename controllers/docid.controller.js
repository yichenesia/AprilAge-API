'use strict';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js';

/*******************************************************************************
GET /users/:email/documents/:docid
*******************************************************************************/
export const retrieveAgingDoc = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();

    return res.json({ 
      connectedToAPI: connectedToApiResult,
      connectedToDB: connectedToDatabaseResult,
      agingDoc: '',
      status: 'Retrieved aging doc.'
    });
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

    return res.json({ 
      connected: connectedToDatabaseResult,
      deletionStatus: true,
      status: 'Deleted aging doc.'
    });
  } catch(err) {
    next(err);
  }
};


/*******************************************************************************
GET /users/:email/documents/:docid/points
*******************************************************************************/
export const points = async (req, res, next) => {
  try {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const path = 'test.jpg';
    res.sendFile(path, {root: __dirname});
  } 
  catch(err) {
    next(err);
  }
};

/*******************************************************************************
PUT /users/:email/documents/:docid/featurePoints
*******************************************************************************/
// export const featurePoints = async (req, res, next) => {
//   try {
//     const connectedToDatabaseResult = await connectedToDatabase();
    
//     return res.json({ connected: connectedToDatabaseResult });
//   } catch(err) {
//     next(err);
//   }
// };

// /*******************************************************************************
// POST /users/:email/documents/:docid/match
// *******************************************************************************/
// export const match = async (req, res, next) => {
//   try {
//     const connectedToDatabaseResult = await connectedToDatabase();
//     return res.json({ connected: connectedToDatabaseResult });
//   } catch(err) {
//     next(err);
//   }
// };

/*******************************************************************************
POST /users/:email/documents/:docid/aging
*******************************************************************************/
export const aging = async (req, res, next) => {
  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ 
      connected: connectedToDatabaseResult,
      status: "Requested AprilAge API to age image."
    });
  } catch(err) {
    next(err);
  }
};

// /*******************************************************************************
// POST /users/:email/documents/:docid/detectMatchAge
// *******************************************************************************/
// export const detectMatchAge = async (req, res, next) => {
//   try {
//     const connectedToDatabaseResult = await connectedToDatabase();
//     return res.json({ 
//       connected: connectedToDatabaseResult,
//       status: ""
//     });
//   } catch(err) {
//     next(err);
//   }
// };

/*******************************************************************************
GET /users/:email/documents/:docid/status
*******************************************************************************/
export const status = async (req, res, next) => {
  try {
    const connectedToDatabaseResult = await connectedToDatabase();
    return res.json({ 
      connected: connectedToDatabaseResult,
      status: "Returns the status of an aging document"
    });
  } catch(err) {
    next(err);
  }
};