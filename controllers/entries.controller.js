'use strict';

/**
 * Module dependencies.
 */
import entryModel from '../models/entry.model.js';
import { validate } from '../utils/validation.utils.js';
import expressValidator from 'express-validator';

const { check } = expressValidator;

export const createValidation = validate([
  check('name','Entry name must be populated')
  .notEmpty()
]);

/*******************************************************************************
POST /entries
Create route. logs in after creation
*******************************************************************************/
export const create = async (req, res, next) => {
  // We don't need checkbody, but we could use it here.

  const userId = req.user.id;
  const name = req.body.name;
  const text = req.body.text;

  try {
    const resultId = await entryModel.create({ userId, name, text });
    const resultEntry = await entryModel.findById(resultId);
    return res.json(resultEntry);
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
PUT /entries/:entryId
*******************************************************************************/
export const update = async (req, res, next) => {
  const { name, text } = req.body;
  const entryId = req.params.entryId;
  const userId = req.user.id;

  try {
    const result = await entryModel.updateById(entryId,  userId, {name, text});
    const updatedResult = await entryModel.findById(entryId);
    
    return res.json(updatedResult);
  } catch(err) {
    next(err);
  };
};

/*******************************************************************************
GET /entries
*******************************************************************************/
export const get = async (req, res, next) => {
  try {
    const results = await entryModel.findByUserId(req.user.id);
    
    return res.json(results);
  } catch(err) {
    next(err);
  };
};
