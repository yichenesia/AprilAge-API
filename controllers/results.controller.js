'use strict';

import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js'; // change model later
import resultModel from "../models/agingResult.model.js"; 
import AgingDocument from '../models/agingDocument.model.js';

//GET aging results for an aging doc
export const getResults = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();

    if (connectedToApiResult && connectedToDatabaseResult) {
      //const docs = await AgingDocument.findById(req.params.docID);
      const results = await resultModel.findByDOCId(req.params.docID);
      return res.json({results});
    }
  } catch(err) {
    next(err);
  }
};
