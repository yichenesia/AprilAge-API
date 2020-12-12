"use strict";

import {
  connectedToApi,
  connectedToDatabase,
} from "../models/status.model.js";
import imageModel from "../models/images.model.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const formidable = require("formidable");
const AWS = require("aws-sdk");
const fs = require("fs");

var path = require("path");

AWS.config.update({ region: "us-east-2" });
const BUCKET_NAME = "uoft-terraform.ollon.ca";
const URI = "https://s3.us-east-2.amazonaws.com/" + BUCKET_NAME + "/";

const s3 = new AWS.S3();

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
        try {
          uploadToS3(file); // upload the image to the s3 bucket
        } catch {
          res.status(404).send("Bad Request: no image provided");
          return res;
        }
        imageObj.uri = URI + file.image.name;
        const image = imageModel.create(imageObj);
        return res.json(imageObj);
      });
    }
  } catch (err) {
    res.status(500).send("Internal Server Error.");
    return res;
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
      try {
        const image = await imageModel.findById(req.params.id);
        return res.json(image.uri);
      } catch {
        res.status(404).send("Bad Request: cannot find image");
        return res;
      }
    }
  } catch (err) {
    res.status(500).send("Internal Server Error.");
    return res;
  }
};
