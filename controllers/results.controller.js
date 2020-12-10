'use strict';

import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js'; // change model later
import resultModel from "../models/agingResult.model.js"; 
import AgingDocument from '../models/agingDocument.model.js';
import agedImage from '../models/agedImage.model.js';
import agingSequence from '../models/agingSequence.model.js';

import user from "../models/user.model.js"; 
import db from '../services/db.js';
import { objectToCamelCase } from '../models/base.model.js';

//GET Aging Results for an Aging Document
export const getResults = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();

    if (connectedToApiResult && connectedToDatabaseResult) {
      const doc = await AgingDocument.findById(req.params.docID);
      if (doc == undefined){
        res.status(404);
        res.send("Aging Document not found");
        return;
      }
      // Check if this aging document does not belong to this user
      const foundUser = await user.findById(doc.userId);
      if (foundUser.email != req.params.email) {
        res.status(403);
        res.send("Aging Document does not belong to this user!");
        return;
      }

      const results = await resultModel.findByDOCId(req.params.docID);

      // Find the number of results for this document
      var sql = 'SELECT count(id) as num from agingResult WHERE agingResult.agingDocument =' + String(req.params.docID);
        const result = await db.raw(sql, []).then((sqlResults) => {
          return(objectToCamelCase(sqlResults[0][0]));
        });

      var arrResults = [];
      var i;
      for (i = 0; i< parseInt(result.num); i++) {

        if (results[i] == undefined) {
          res.status(404);
          res.send("Aging result not found");
          return;
        }

        const id = results[i].id;
        console.log(id);

        const img = await agedImage.findByResultID(id);
        if (img == undefined) {
          res.status(404);
          res.send("Aged image not found");
          return;
        }
      
        const uri = img.uri;
        const status = doc.status;
        const sequenceType = results[i].sequenceType;
        const sequenceID = results[i].sequenceID;
        console.log(sequenceID);
        const sequences = await agingSequence.findById(sequenceID);

        if (sequences == undefined) {
          res.status(404);
          res.send("Aging sequence not found");
          return;
        }

        const obj = {
          uri: uri,
          status:status,
          sequenceType: sequenceType,
          sequences: sequences
        }
        arrResults.push(obj);
      }
      return res.json(arrResults);
    }
  } catch(err) {
    next(err);
  }
};
