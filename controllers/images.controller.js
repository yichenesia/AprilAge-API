'use strict';

import { connectedToApi, connectedToDatabase } from '../models/healthCheck.model.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const formidable = require("formidable");


/*******************************************************************************
POST /images
*******************************************************************************/
export const uploadImageApi = async (req, res, next) => {
    try {
        const form = formidable({multiples: true});
        form.parse(req, (err, fields, files) => {
          return res.json({fields, files});
        });
    } catch(err) {
      next(err);
    }
  };