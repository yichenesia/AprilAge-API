"use strict";

import {
  connectedToApi,
  connectedToDatabase,
} from "../models/healthCheck.model.js";
import imageModel from "../models/images.model.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const formidable = require("formidable");
const AWS = require("aws-sdk");
const fs = require("fs");
var path = require("path");

const BUCKET_NAME = "uoft-terraform.ollon.ca";
const ID = "AKIA2SRCFREAA3RGGDTC";
const SECRET = "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";
const URI = "https://s3.us-east-2.amazonaws.com/" + BUCKET_NAME + "/";

const s3 = new AWS.S3({
  accessKeyId: ID,
  secretAccessKey: SECRET,
});

const uploadToS3 = (file) => {
  var fileStream = fs.createReadStream(file.image.path);
  fileStream.on("error", function (err) {
    console.log("File Error", err);
  });

  const params = {
    Bucket: BUCKET_NAME,
    Key: file.image.name,
    Body: fileStream,
  };

  s3.upload(params, (err, data) => {
    if (err) {
      throw err;
    }
  });
};

/*******************************************************************************
POST /images
*******************************************************************************/
export const uploadImageApi = async (req, res, next) => {
  const imageObj = {};
  try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();
    if (connectedToApiResult && connectedToDatabaseResult) {
      const form = formidable({ multiples: false });
      form.parse(req, (err, fields, file) => {
        uploadToS3(file); // upload the image to the s3 bucket
        imageObj.uri = URI + file.image.name;
        const image = imageModel.create(imageObj);
        return res.json(imageObj);
      });
    }
  } catch (err) {
    next(err);
  }
};

/*******************************************************************************
GET /images/:id
*******************************************************************************/
export const getImageApi = async (req, res, next) => {
  try {
    const connectedToApiResult = connectedToApi();
    const connectedToDatabaseResult = await connectedToDatabase();

    if (connectedToApiResult && connectedToDatabaseResult) {
      const image = await imageModel.findById(req.params.id);
      return res.json(image.uri);
    }
  } catch (err) {
    next(err);
  }
};
