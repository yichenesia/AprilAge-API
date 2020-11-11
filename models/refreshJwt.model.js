'use strict';

import _ from 'lodash';
import db from '../services/db.js';
import { upsert, objectToSnakeCase, objectToCamelCase } from './base.model.js';

const RefreshJwt = {
  findByUserId: async (userId, cn = db) => {
    if ((!userId) || (userId.length === 0)) {
      return Promise.reject(new Error('findById() No id specified!'));
    }
    const userSql = 'SELECT jwt.* FROM jwt_tokens as jwt WHERE user_id = ?';

    return cn.raw(userSql, [userId]).then((userSqlResults) => {
      return(objectToCamelCase(userSqlResults[0][0]));
    });
  },
  findByUserIdAndRefreshToken : (userId, refreshToken, cn = db) => {
    if ((!refreshToken) || (refreshToken.length === 0)) {
      return Promise.reject(new Error('findById() No id specified!'));
    }

    const userSql = 'SELECT jwt.* FROM jwt_tokens as jwt WHERE user_id = ? AND refresh_token LIKE ?';

    return cn.raw(userSql, [userId, `%${refreshToken}%`]).then((userSqlResults) => {
      return(objectToCamelCase(userSqlResults[0][0]));
    });
  },
  upsertRefreshToken: (userId, refreshToken, cn = db) => {
    if ((!userId) || (userId.length === 0)) {
      return Promise.reject(new Error('deleteById() No id specified!'));
    }

    return upsert(
      { 
        tableName: 'jwt_tokens',
        columns: ['user_id', 'refresh_token'],
        upsertColumns: ['refresh_token']
      }, 
      [objectToSnakeCase({ userId, refreshToken })],
      cn
    );
  },
};

export default RefreshJwt;
