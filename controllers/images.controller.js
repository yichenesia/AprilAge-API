'use strict';

import imageModel from '../models/images.model.js';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const formidable = require("formidable");


/*******************************************************************************
POST /images
*******************************************************************************/
export const uploadImageApi = async (req, res, next) => {
  const imageObj = {};
  try {
      const form = formidable({multiples: true});
      form.parse(req, (err, fields, files) => {
        imageObj.uri = files.image.path;
        const image = imageModel.create(imageObj);
        return res.json(imageObj);
        //return res.json({fields, files});
      });
  } catch(err) {
    next(err);
  }
};