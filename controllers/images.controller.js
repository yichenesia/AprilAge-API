"use strict";

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
    Key: path.basename(file.image),
    Body: fileStream,
    // ContentType: "multipart/form-data",
  };

  s3.upload(params, (err, data) => {
    if (err) {
      throw err;
    }
    console.log("Image uploaded successfully to " + data.location);
  });
};

/*******************************************************************************
POST /images
*******************************************************************************/
export const uploadImageApi = async (req, res, next) => {
  const imageObj = {};
  try {
    const form = formidable({ multiples: false });
    form.parse(req, (err, fields, files) => {
      uploadToS3(files); // upload the image to the s3 bucket

      // imageObj.uri = files.image.path;
      // const image = imageModel.create(imageObj);
      // return res.json(imageObj);
    });
  } catch (err) {
    next(err);
  }
};
