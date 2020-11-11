// create a JWT token from payload
import _ from 'lodash';
import jwt from 'jsonwebtoken';
import refreshJwtModel from '../models/refreshJwt.model.js';

// JWTExpires in seconds
let config = {
  sessionSecret: undefined,
  refreshSessionSecret: undefined,
  refreshExpires: '7d', // 7 days
  jWTExpires: '60m', // 60 mins
};

export const init = async (initConfig) => {
  config = _.merge(config,initConfig);
  return true;
};

// Check if token has expired
// token = to check, offset = in milliseconds
export const checkIfTokenExpired = (token, offset = 0) => {
  const decoded = jwt.decode(token);
  return Date.now() + offset >= decoded.exp * 1000; 
};

// Update JWT refresh token, clean jwt. 
export const addAndCleanJwtRefreshTokens = async (
  userId,
  token,
  options = { tokensToRemove: [], expiryOffset: 0 }
) => {
  const { tokensToRemove = [], expiryOffset = 0 } = options;
  const existingRow = await refreshJwtModel.findByUserId(userId);
  let newRefreshTokens = [];

  // clean up any tokens that are expired.
  if (existingRow) {
    const refreshTokens = _.split(existingRow.refreshToken || '', ',');

    newRefreshTokens = refreshTokens.reduce((result, curVal) => {
      if(!checkIfTokenExpired(curVal, expiryOffset) && !(_.find(tokensToRemove, (t) => { return t === curVal}))) {
        result.push(curVal);
      }
      
      return result;
     }, []);
  }

  newRefreshTokens.push(token);

  const result = await refreshJwtModel.upsertRefreshToken(userId, newRefreshTokens.join(','));

  return result;
};

export const createToken = (userObj, options) => {
  const { expiresIn = config.JWTExpires } = options;
  const payloadObj = {
    email: userObj.email,
    id: userObj.id,
    type: userObj.type,
  };

  return jwt.sign(payloadObj, config.sessionSecret, { expiresIn });
};

export const createTokens = async (userObj, options = {}) => {
  const { 
    expiresIn = config.jWTExpires,
    refreshExpiresIn = config.refreshExpires,
    refreshTokenToRefresh = null,
    includeRefreshToken = true,
  } = options;

  const userId = userObj ? userObj.id : null;
  const token = await Promise.resolve(createToken(userObj, { expiresIn }));
  const authToken = token;
  const finalResult = { token: authToken };

  if (includeRefreshToken || refreshTokenToRefresh) {
    const refreshToken = jwt.sign({id: userId}, config.refreshSessionSecret, { expiresIn: refreshExpiresIn});
    
    await addAndCleanJwtRefreshTokens(userId, refreshToken, { tokensToRemove: refreshTokenToRefresh ? [refreshTokenToRefresh] : undefined }); 
    
    finalResult.refreshToken = refreshToken;
  }

  return finalResult;
};
