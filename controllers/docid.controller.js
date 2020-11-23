'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from '../models/base.model.js';
import userModel from '../models/user2.model.js'
import agingDocModel from '../models/agingDocument.model.js';

/*******************************************************************************
GET /users/:email/documents/:docID

Testing:

email: user@kermitism.com
docid: 48489375949
result: Error 404

email: admin@example.com
docid: 2
result: Error 403

email: user@kermitism.com
docid: 2
result: JSON aging doc
*******************************************************************************/
export const retrieveAgingDoc = async (req, res, next) => {
  try {

    const docID = req.params.docID;
    const email = req.params.email;
    const agingDoc = await agingDocModel.findById(docID);
    const user = await userModel.findByEmail(email);

    const sql = 'SELECT agingDocument.* FROM agingDocument WHERE userID = ?';
      const result = await db.raw(sql, [user.id]).then((sqlResults) => {
        return(objectToCamelCase(sqlResults[0]));
      });

    var found = false;

    for (var k in result) {
      if (result[k].id == docID) {
        found = true;
        break
      }
    }

    if (agingDoc == undefined) {
        res.status(404).send("Error 404: Aging Document not found.")
    }
    else if (!found){
        res.status(403).send("Error 403: Document does not belong to user.")
    }
    else {
      return res.json(agingDoc);
    }
    
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
DELETE /users/:email/documents/:docID

email: user@kermitism.com
docid: 48489375949
result: Error 404

email: admin@example.com
docid: 2
result: Error 403
*******************************************************************************/
export const removeAgingDoc = async (req, res, next) => {
  try {
    const docID = req.params.docID;
    const email = req.params.email;
    const agingDoc = await agingDocModel.findById(docID);
    const user = await userModel.findByEmail(email);

    const sql = 'SELECT agingDocument.* FROM agingDocument WHERE userID = ?';
      const result = await db.raw(sql, [user.id]).then((sqlResults) => {
        return(objectToCamelCase(sqlResults[0]));
      });

    var found = false;

    for (var k in result) {
      if (result[k].id == docID) {
        found = true;
        break
      }
    }

    if (agingDoc == undefined) {
      res.status(404).send("Error 404: Aging Document not found.")
    }
    else if (!found){
      res.status(403).send("Error 403: Document does not belong to user.")
    }
    else {
      await agingDocModel.deleteById(docID);
      res.status(200).end();
  }
  } catch(err) {
    next(err);
  }
};


/*******************************************************************************
GET /users/:email/documents/:docID/points

email: admin@example.com
docid: 1
result: {
  uri: kermit meme
  age: 69
}
*******************************************************************************/
export const points = async (req, res, next) => {
  try {
    const docID = req.params.docID;
    const email = req.params.email;
    const agingDoc = await agingDocModel.findById(docID);
    const user = await userModel.findByEmail(email);

    const sql = 'SELECT agingDocument.* FROM agingDocument WHERE userID = ?';
      const result = await db.raw(sql, [user.id]).then((sqlResults) => {
        return(objectToCamelCase(sqlResults[0]));
      });

    var found = false;

    for (var k in result) {
      if (result[k].id == docID) {
        found = true;
        break
      }
    }

    const sqlImg = 'SELECT agedImage.uri FROM agingDocument, agingResult, agedImage WHERE agingDocument.userID = ? AND agingDocument.id = ? AND agingResult.agingDocument = agingDocument.id AND agingResult.id = agedImage.resultID';
      const resultImg = await db.raw(sqlImg, [user.id, docID]).then((sqlResults) =>  {
        return(objectToCamelCase(sqlResults[0]));
    });

    if (agingDoc == undefined) {
      res.status(404).send("Error 404: Aging Document not found.")
    }
    else if (!found){
      res.status(403).send("Error 403: Document does not belong to user.")
    }
    else if (Object.keys(resultImg).length == 0) {
      res.status(307).end();
    }
    else {
      const imgUrl = resultImg['0'].uri;

      res.json({
        "uri": imgUrl,
        "age": agingDoc.age
      })
      // res.send("<img src = "+imgUrl+">");
    }
    
  } 
  catch(err) {
    next(err);
  }
};

/*******************************************************************************
POST /users/:email/documents/:docID/aging

Testing: 

Send in Postman under the "Body" section
{
    "sequenceType": "Max72",
    "sequences": [{
        "smoking": 0,
        "sunExposure": 0,
        "multiplier": 1
    }]
}

This is the "Aging Request Representation" that this method needs
*******************************************************************************/
export const aging = async (req, res, next) => {
  try {
    const docID = req.params.docID;
    const email = req.params.email;
    const agingDoc = await agingDocModel.findById(docID);
    const user = await userModel.findByEmail(email);

    const sql = 'SELECT agingDocument.* FROM agingDocument WHERE userID = ?';
      const result = await db.raw(sql, [user.id]).then((sqlResults) => {
        return(objectToCamelCase(sqlResults[0]));
      });

    var found = false;

    for (var k in result) {
      if (result[k].id == docID) {
        found = true;
        break
      }
    }

    if (agingDoc == undefined) {
        res.status(404).send("Error 404: Aging Document not found.")
    }
    else if (!found){
        res.status(403).send("Error 403: Document does not belong to user.")
    }
    else {
      console.log("Aging request successfuly sent to AprilAge")
      console.log(req.body) // You send an Aging Request Representation in JSON (sequence types) to AprilAge
      return res.status(202).end();
    }
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
GET /users/:email/documents/:docID/status

email: admin@example.com
docid: 1
result: {
    "status": "uploaded"
}
*******************************************************************************/
export const status = async (req, res, next) => {
  try {
    const docID = req.params.docID;
    const email = req.params.email;
    const agingDoc = await agingDocModel.findById(docID);
    const user = await userModel.findByEmail(email);

    const sql = 'SELECT agingDocument.* FROM agingDocument WHERE userID = ?';
      const result = await db.raw(sql, [user.id]).then((sqlResults) => {
        return(objectToCamelCase(sqlResults[0]));
      });

    var found = false;

    for (var k in result) {
      if (result[k].id == docID) {
        found = true;
        break
      }
    }

    if (agingDoc == undefined) {
        res.status(404).send("Error 404: Aging Document not found.")
    }
    else if (!found){
        res.status(403).send("Error 403: Document does not belong to user.")
    }
    else {
      return res.status(200).json({"status": agingDoc.status});
    }
  } catch(err) {
    next(err);
  }
};