'use strict';

import config from '../config/config.js';
import passport from 'passport';
import _ from 'lodash';
import userModel from '../models/user.model.js';
import logger from '../services/logger.service.js';
import { createTokens } from '../services/jwt.service.js';
import { isInvalidValue, isValidValue, validate } from '../utils/validation.utils.js';
import expressValidator from 'express-validator';
import { objectToSnakeCase } from '../models/base.model.js';

const { check, param, body } = expressValidator;

/**
 * Auth callback - for Facebook etc login strategies
 */
export const authCallback = (req, res) => {
  res.redirect('/');
};

export const createValidation = validate([
  check('password', 'Password not provided').notEmpty(),
  check('email', 'Email is invalid').isEmail(),
]);

export const updatePasswordValidation = validate([
  param('userId', 'Please provide a userId').isInt(),
  body('password', 'Please provide a password').notEmpty(),
]);

export const resetPasswordValidation = validate([
  param('resetKey', 'Please provide a userId').isInt(),
  body('password', 'Please provide a password').isInt(),

])

/*******************************************************************************
// POST /login
// This is the login route
*******************************************************************************/
export const logUserIn = async (req, res, next) => {
  passport.authenticate('local-login', async (err, userObj, info) => {
    if (err) {
      return next(err);
    }

    if (!userObj
      && req.body.email
      && (req.body.password === '' || typeof req.body.password === 'undefined')
    ) {
      try {
        const user = await userModel.findByEmail(req.body.email);
        return res.status(400).json([{ msg: 'Invalid email or password'}]);
      } catch(err) {
        return next(err);
      }
    } else if (!userObj) {
      return res.status(400).json([{ msg: 'Invalid email or password'}]);
    } else {
      const tokens = await createTokens(userObj);

      return res.json({ authToken : tokens.token, refreshToken: tokens.refreshToken });
    }
  })(req, res, next);
};

/*******************************************************************************
POST /users
Create route. logs in after creation
*******************************************************************************/
export const create = async (req, res, next) => {
  const userObj = {};
  userObj.username = req.body.username;
  userObj.salt = userModel.makeSalt();
  userObj.hashedPassword = userModel.encryptPassword(userObj.salt, req.body.password);

  if (isValidValue(req.body.firstName)) {
    userObj.firstName = req.body.firstName;
  }

  if (isValidValue(req.body.lastName)) {
    userObj.lastName = req.body.lastName;
  }

  userObj.email = req.body.email;

  try {
    const existingUser = await userModel.findByEmail(userObj.email);
    if (existingUser) {
      return res.status(400).send({ 'message': 'User exists!' });
    } else {
      const insertResult = await userModel.create(userObj);
      const userResult = await userModel.findById(insertResult);
      const tokens = await createTokens(userResult);
        
      return res.json({ authToken : tokens.token, refreshToken: tokens.refreshToken });
    }
  } catch(err) {
    next(err);
  };
};

export const me = (req, res, next) => {
  const userObj = req.user;
  res.json(userObj ? userModel.cleanUserData(userObj) : null);
};

/*******************************************************************************
PUT /users/:id
*******************************************************************************/
export const update = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const userObj = req.body;

  if (req.user.id !== userId) {
    return res.status(403).send();
  }

  try {
    if (userObj.email) {
      const foundUserObj = await userModel.findByEmail(userObj.email);

      if (foundUserObj && foundUserObj.email && foundUserObj.id !== userId) {
        return res.status(409).send('Email address already in use');
      }
    }

    const keys = ['firstName', 'lastName', 'email'];
    const params = _.pick(userObj, keys);

    const foundUserObj = await userModel.findById(userId);

    if (isInvalidValue(foundUserObj)) {
      return res.status(404).json({ msg: "User does not exist." });
    }

    const userResultObj = await userModel.updateById(userId, objectToSnakeCase(params));

    return res.json(userModel.cleanUserData(userResultObj));
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
POST /refreshAuth
*******************************************************************************/
export const refreshAuth = async (req, res, next) => {
  const user = req.user;
  try {
    const userResult = await userModel.findById(user.id);
    const shouldRefresh = typeof req.body.refreshRefreshToken === 'undefined' 
      ? config.jwt.refreshRefreshOnUse 
      : req.body.refreshRefreshToken;
    const refreshTokenToRefresh = shouldRefresh  ? req.authInfo.refreshToken : undefined;

    // refresh refreshToken (replacing old refresh token), if expiration threshold has passed
    const tokens = await createTokens(
      userResult,
      { 
        refreshTokenToRefresh: refreshTokenToRefresh,
        includeRefreshToken: refreshTokenToRefresh ? true : false,
      }, 
    );
    
    return res.json({ authToken : tokens.token, refreshToken: tokens.refreshToken });
  } catch(err) {
    next(err);
  }
};

/*******************************************************************************
PUT /users/reset
*******************************************************************************/
export const createResetKey = async (req, res, next) => {
  var userToReset = req.body;

  if ((!userToReset) || isInvalidValue(userToReset.email)) {
    return res.status(400).send({ msg: 'No email provided' });
  }

  try {
    const userObj = userModel.findByEmail(userToReset.email); 
    
    if ((!userObj) || (userObj.deletedUser === 1)) {
      return res.status(404).send({ msg: 'unknown user' });
    }

    userObj.resetKey = userModel.createGenericToken();
    await userModel.updateResetKey(userObj.id, userObj.resetKey);

    const variables = {
      name: userObj.firstName,
      resetUrl: config.domain + '/password-reset/' + userObj.resetKey
    };

    logger.info('Sending password reset email to user ' + userObj.email);
    logger.debug('resetUrl: ' + variables.resetUrl);
      
    return res.status(200).send();
  } catch(err) {
    next(err);
  };
};

/*******************************************************************************
PUT /users/reset/:resetKey
*******************************************************************************/
export const resetPassword = async (req, res, next) => {
  const password = req.body.password;

  if (isInvalidValue(password)) {
    return res.status(400).send({ msg: 'No password provided' });
  }

  const resetKey = req.params.resetKey;

  try {  
    const userObj = await userModel.findByResetKey(resetKey);
    if ((!userObj) || (userObj.deletedUser === 1)) {
      return res.status(404).send();
    }

    let newSalt = userModel.makeSalt();
    let hashedPassword = userModel.encryptPassword(newSalt, password);

    userObj.hashedPassword = hashedPassword;
    userObj.resetKey = null;
    await userModel.updatePassword(userObj.id, hashedPassword, newSalt);
    
    return res.status(200).send();
  } catch(err) {
    next(err);
  };
};

/*******************************************************************************
PUT /users/:id/password
*******************************************************************************/
export const updatePassword = async (req, res, next) => {
  const userId = parseInt(req.params.userId);
  const password = req.body.password;

  if (req.user.id !== userId) {
    return res.status(403).send();
  }

  let newSalt = userModel.makeSalt();
  let hashedPassword = userModel.encryptPassword(newSalt, password);

  try {
    await userModel.updatePassword(userId, hashedPassword, newSalt);
    const userObj = await userModel.findById(userId);

    const variables = {
      id: userId,
      name: userObj.firstName
    };
        
    return res.status(200).json(variables);
  } catch(err) {
    next(err);
  };
};
