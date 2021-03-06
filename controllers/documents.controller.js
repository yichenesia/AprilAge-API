'use strict';

import userModel from '../models/user.model.js'
import agingDocModel from '../models/agingDocument.model.js'
import imageModel from '../models/images.model.js'

/*******************************************************************************
GET /users/:email/documents
*******************************************************************************/
export const retrieveAgingDocs = async (req, res, next) => {
  const email = req.params.email;
  const user = await userModel.findByEmail(email);
  if (!user) {
    res.status(404);
    res.send('User not found');
    return;
  }
  try {
    const parseFilters = makeFilterObj(email, req.body.filter, req.body.orderBy);
    var returnObj = parseFilters[0];
    var filters = parseFilters[1];
    
    const result = await agingDocModel.findWithFilter(user.id, filters);
    returnObj.items = result;
    returnObj.totalItems = Object.keys(result).length;

    return res.json(returnObj);
    
  } catch(err) {
    console.log(err);
    next(err);
  }
};

/*******************************************************************************
POST /users/:email/documents
*******************************************************************************/
export const createAgingDoc = async (req, res, next) => {
  try {
    const email = req.params.email;
    const user = await userModel.findByEmail(email);
    if (!user) {
      res.status(404);
      res.send('User not found');
      return;
    }
    // New Document Request Representation
    const imageId = req.body.imageId;
    const imageUri = req.body.imageUri;
    // Aging Document Representation
    const agingDoc = req.body.document;
    // const status = agingDoc.status;
    const isSample = agingDoc.isSample;
    const name = agingDoc.name;
    const gender = agingDoc.gender;
    const age = agingDoc.age;
    const ethnicity = agingDoc.ethnicity;
    const height = agingDoc.height;
    const weight = agingDoc.weight;
    const measurement = agingDoc.measurement;
    const bounds = agingDoc.bounds;

    // const allowed_status = ['uploaded',	'aging_pending', 'aging_complete', 'aging_failed'];
    const allowed_gender = ['male', 'female'];
    const allowed_ethnicity = ['Caucasian', 'Asian', 'African', 'Hispanic', 'SouthAsian'];
    const allowed_measurement = ['metric', 'imperial'];
    
    const newDocument = {
      'userId': user.id
    }

    var img = "image";
    if (imageId) {
      img = await imageModel.findById(imageId);
      newDocument.originalImage = imageId;
    } else if (imageUri) {
      img = await imageModel.findByUri(imageUri);
      newDocument.originalImage = img.id;
    } else if (!img) {
      res.status(403);
      res.send('Invalid image');
      return;
    }
    else {
      res.status(403);
      res.send('Missing sample image');
      return;
    }
    // if (allowed_status.includes(status)) {
    newDocument.status = 'uploaded';
    // } else {
    //  res.status(400);
    //  res.send('Invalid input for status');
    //  return;
    // }
    if (typeof isSample == "boolean") {
      isSample ? newDocument.isSample = 1 : newDocument.isSample = 0;
    } else {
      res.status(400);
      res.send('Invalid input for sample');
      return;
    }
    if (name) {
      newDocument.name = name;
    }
    if (allowed_gender.includes(gender)) {
      newDocument.gender = gender;
    } else {
      res.status(400);
      res.send('Invalid input for gender');
      return;
    }
    if (age > 6 && age < 65) {
      newDocument.age = age;
    } else {
      res.status(400);
      res.send('Invalid input for age');
      return;
    }
    if (allowed_ethnicity.includes(ethnicity)) {
      newDocument.ethnicity = ethnicity;
    } else if (ethnicity) {
      res.status(400);
      res.send('Invalid input for ethnicity');
      return;
    }
    if ((measurement == 'metric' && height > 92 && height < 213)
    || (measurement == 'imperial' && height > 36 && height < 84)) {
      newDocument.height = height;
    } else if (height) {
      res.status(400);
      res.send('Invalid input for height');
      return;
    }
    if ((measurement == 'metric' && weight > 23 && weight < 136)
    || (measurement == 'imperial' && weight > 50 && weight < 300)) {
      newDocument.weight = weight;
    } else if (weight) {
      res.status(400);
      res.send('Invalid input for weight');
      return;
    }
    if (allowed_measurement.includes(measurement)) {
      newDocument.measurement = measurement;
    } else if (measurement) {
      res.status(400);
      res.send('Invalid input for measurement');
      return;
    }
    if (bounds && bounds.length == 4 && Number.isFinite(bounds[0]) && Number.isFinite(bounds[1]) && Number.isFinite(bounds[2]) && Number.isFinite(bounds[3])) {
      newDocument.bounds = bounds.join(",");
    } else if (bounds) {
      res.status(400);
      res.send('Invalid input for bounds');
      return;
    }

    const newDocId = await agingDocModel.create(newDocument)
    newDocument.id = newDocId
    return res.json(newDocument);   

  } catch(err) {
    console.log(err);
    next(err);
  }
};

/*******************************************************************************
GET /users/:email/document/results
*******************************************************************************/
export const retrieveAgingResults = async (req, res, next) => {
  const email = req.params.email;
  const user = await userModel.findByEmail(email);
  if (!user) {
    res.status(404);
    res.send('User not found');
    return;
  }
  try {
    const parseFilters = makeFilterObj(email, req.body.filter, req.body.orderBy);
    var returnObj = parseFilters[0];
    var filters = parseFilters[1];

    const result = await agingDocModel.findAgings(user.id, filters);
    returnObj.items = result;
    returnObj.totalItems = Object.keys(result).length;

    return res.json(returnObj);
  
  } catch(err) {
    console.log(err);
    next(err);
  }
};

const makeFilterObj = (email, filter, orderBy) => {
  // pagination not supported (11/25/20)
  const allowed_fields = ["status", "age", "ethnicity", "gender", "name"];
  const filter_regex = RegExp('.*[<|=|>].*');

  const returnObj = {
    email: email
  }
  var filters = {};

  if (filter_regex.test(filter)) {
    const field = RegExp('^\\w*'); // get attribute to filter by (e.g. age, name) 
    const operator = RegExp('[<|=|>]'); // get comparator
    const value = RegExp('\\w*$'); // get value to filter for
    if (allowed_fields.includes(filter.match(field)[0])) {
      returnObj.filter = filter;
      filters.filter = {
        field: filter.match(field)[0],
        operator: filter.match(operator)[0],
        value: filter.match(value)[0]
      };
    } else {        
      res.status(400);
      res.send('Invalid input for filter field');
      return;
    }
  } else if (filter) {        
    res.status(400);
    res.send('Invalid input for filter');
    return;
  }
  if (allowed_fields.includes(orderBy)) {
    returnObj.orderBy = orderBy;
    filters.orderBy = orderBy;
  } else if (orderBy) {        
    res.status(400);
    res.send('Invalid input for order by');
    return;
  }

  return [returnObj, filters];
};