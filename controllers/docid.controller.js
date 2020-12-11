'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from '../models/base.model.js';
import userModel from '../models/user.model.js'
import agingDocModel from '../models/agingDocument.model.js';
import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js';
import agingSeqModel from '../models/agingSequence.model.js'
import { createRequire } from "module";

const require = createRequire(import.meta.url);

export const checkDBForMatch = async (docID, email) => {
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

    return {"foundStatus": found, "user": user};

}

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

    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();

    if (connectedToApiResult && connectedToDatabaseResult) {
      const docID = req.params.docID;
      const email = req.params.email;
      const agingDoc = await agingDocModel.findById(docID);
      const response = await checkDBForMatch(docID, email);
      const found = response["foundStatus"];

      if (agingDoc == undefined) {
          res.status(404).send("Error 404: Aging Document not found.")
      }
      else if (!found){
          res.status(403).send("Error 403: Document does not belong to user.")
      }
      else {
        return res.json(agingDoc);
      }
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
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();

    if (connectedToApiResult && connectedToDatabaseResult) {
      const docID = req.params.docID;
      const email = req.params.email;
      const agingDoc = await agingDocModel.findById(docID);
      const response = await checkDBForMatch(docID, email);
      const found = response["foundStatus"];

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
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();

    if (connectedToApiResult && connectedToDatabaseResult) {
      const docID = req.params.docID;
      const email = req.params.email;
      const response = await checkDBForMatch(docID, email);
      const found = response["foundStatus"];
      const user = response["user"];
      const agingDoc = await agingDocModel.findById(docID);

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
    "sequences": [
        {
            "smoking": 1,
            "sunExposure": 1,
            "bmi": 22,
            "bmiFunc": "Constant",
            "multiplier": 0,
            "images": [
                {
                    "Filename": "sokka_75.jpeg",
                    "Age": 75,
                    "Id": 6
                }
            ]
        }
    ]
}

This is the "Aging Request Representation" that this method needs
*******************************************************************************/

export const aging = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();

    if (connectedToApiResult && connectedToDatabaseResult) {
      const docID = req.params.docID;
      const email = req.params.email;
      const response = await checkDBForMatch(docID, email);
      const found = response["foundStatus"];
      const agingDoc = await agingDocModel.findById(docID);
      const imageID = agingDoc.originalImage;

      // SQS Interaction
      var AWS = require('aws-sdk');

      AWS.config.update({region: 'us-east-2'});

      var sqs = new AWS.SQS({apiVersion: '2020-12-01'});
      
      var sql = 'SELECT image.* FROM image WHERE id = ?';
      const result2 = await db.raw(sql, [imageID]).then((sqlResults) => {
        return(objectToCamelCase(sqlResults[0][0]));
      });

      // Get image name
      const imageURI = result2.uri.split("/");
      const imageName = imageURI[imageURI.length - 1]

      // Store sequence into RDS
      const sequences = req.body["sequences"];

      const sequenceIDs = [];

      for (var item in sequences) {
        var newSeq = {'smoking': sequences[item]["smoking"].toString(), 'sunExposure': sequences[item]["sunExposure"].toString(), 'bmi': sequences[item]["bmi"].toString(), 'bmiFunc': sequences[item]["bmiFunc"].toString(), 'multiplier': sequences[item]["multiplier"].toString(), 'age': sequences[item]["age"].toString()}
        const _ = await agingSeqModel.create(newSeq)

        sequences[item]["images"] = [];
        const agedImg = {}

        const splitName = imageName.split(".");
        const agedImageName = splitName[0].concat("_".concat(sequences[item]["age"])).concat(".".concat(splitName[1]));

        agedImg["Filename"] = agedImageName;
        agedImg["Age"] = sequences[item]["age"];
        agedImg["Id"] = imageID;

        sequences[item]["images"].push(agedImg);

        var sql = 'SELECT MAX(ID) FROM agingSequence';
        const result = await db.raw(sql, []).then((sqlResults) => {
          return(objectToCamelCase(sqlResults[0][0]));
        });

        sequenceIDs.push(result['max(id)']);
      }

      var i;

      for (i = 0; i < sequenceIDs.length; i++) {
        sequences[i]["Id"] = sequenceIDs[i];
      }

      var isSampleBool;
      agingDoc.isSample ? isSampleBool = true : isSampleBool = false;

      const agingInfo = 
      {
        "Document":
          {
            "Name": agingDoc.name,
            "Age": agingDoc.age,
            "Gender": agingDoc.gender,
            "Ethnicity": agingDoc.ethnicity,
            "Filename": imageName,
            "Height": agingDoc.height,
            "Weight": agingDoc.weight,
            "Measurement": agingDoc.Measurement,
            "Status": agingDoc.status,
            "Id": agingDoc.id,
            "IsSample": isSampleBool,
            "Image": {
              "Filename": imageName,
              "Age": agingDoc.age,
              "Id": imageID
            }
          },
          
        "Sequences": sequences,
        "Status": "NOT_DONE",
        "SequenceType": req.body["sequenceType"],
        "Id": "1"
      }
      const stringDocs = JSON.stringify(agingInfo);

      var params = {
        DelaySeconds: 3,
        MessageBody: stringDocs,
        QueueUrl: "https://sqs.us-east-2.amazonaws.com/726994880768/AprilEngine-RequestQueue"
      }

      if (agingDoc == undefined) {
          res.status(404).send("Error 404: Aging Document not found.")
      }
      else if (!found){
          res.status(403).send("Error 403: Document does not belong to user.")
      }
      else {
        sqs.sendMessage(params, function(err, data) {
          if (err) {
            console.log("Error", err);
          } else {
            console.log("Success", data.MessageId);
          }
        });
        const _ = await agingDocModel.updateById(docID, {'status': 'aging_pending'});
        return res.status(202).end();
      }
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
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();

    if (connectedToApiResult && connectedToDatabaseResult) {
      const docID = req.params.docID;
      const email = req.params.email;
      const response = await checkDBForMatch(docID, email);
      const found = response["foundStatus"];
      const agingDoc = await agingDocModel.findById(docID);

      if (agingDoc == undefined) {
          res.status(404).send("Error 404: Aging Document not found.")
      }
      else if (!found){
          res.status(403).send("Error 403: Document does not belong to user.")
      }
      else {
        return res.status(200).json({"status": agingDoc.status});
      }
    }
  } catch(err) {
    next(err);
  }
};