'use strict';

import config from '../config/config.js';
import db from '../services/db.js';
import crypto from 'crypto';
import _ from 'lodash';
import { objectToCamelCase } from './base.model.js';

const User = {
  getUsers: (cn = db) => {

    const sql = 'SELECT email FROM users';

    return db.raw(sql, []).then((sqlResults) => {
      return(objectToCamelCase(sqlResults[0]));
    });
  },

  findById: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('findById() No id specified!'));
    }

    const sql = 'SELECT users.* FROM users WHERE id = ?';

    return cn.raw(sql, [id]).then((sqlResults) => {
      return(objectToCamelCase(sqlResults[0][0]));
    });
  },

  findByEmail: (email, cn = db) => {
    if ((!email) || (email.length === -1)) {
      return Promise.reject(new Error('findUserByEmail() No email specified!'));
    }

    const sql = 'SELECT users.* FROM users WHERE email = ? LIMIT 1';

    return cn.raw(sql, [email]).then((sqlResults) => {
      return(objectToCamelCase(sqlResults[0][0]));
    });
  },

  deleteById: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('deleteById() No id specified!'));
    }

    const deleteSql = 'DELETE FROM users WHERE id = ?';
    return cn.raw(deleteSql, [id]);
  },

  deleteByEmail: (email, cn) => {
    if ((!email) || (email.length === 0)) {
      return Promise.reject(new Error('deleteByEmail() No email specified!'));
    }

    const sql = 'DELETE FROM users WHERE email = ?';
    return db.raw(sql, [email]);
  },

  create: (userObj, cn = db) => {
    const fields = ['email', 'hashed_password', 'salt'];
    const values = ['?', '?', '?'];
    const userInsertSqlParams = [
      //userObj.role
      userObj.email,
      userObj.hashedPassword,
      userObj.salt,
    ];

    if ((userObj.firstName) && (userObj.firstName.length > 0)) {
      fields.push('first_name');
      values.push('?');
      userInsertSqlParams.push(userObj.firstName);
    }
    if ((userObj.lastName) && (userObj.lastName.length > 0)) {
      fields.push('lastName');
      values.push('?');
      userInsertSqlParams.push(userObj.lastName);
    }

    const userInsertSql = 'INSERT INTO users (' + fields + ') VALUES(' + values + ')';

    return cn.transaction((trx) => {
      return trx.raw(userInsertSql, userInsertSqlParams)
      .then((userInsertSqlResults) => {
        return userInsertSqlResults[0].insertId;
      }).catch((err) => {
        return trx.rollback(err).then(() => {
          return Promise.reject(err);
        });
      });
    });
  },

  updateById: (userId, userObj) => {
    return db.transaction((trx) => {
      return db('users').transacting(trx).update(userObj).where('id',userId)
        .then((results) => {
          return User.findById(userId, trx);
        })
        .then((results) => {
          return Promise.all([Promise.resolve(results),trx.commit(results)]);
        })
        .catch((err) => {
          return trx.rollback(err)
            .then(() => {
              return Promise.reject(err);
            });
        });
    }).then((results) => {
      return results;
    });
  },

  /**
   * Authenticate - check if the passwords are the same
   *
   * @param {String} salt
   * @param {String} plainText
   * @param {String} hashedPassword
   * @return {Boolean}
   */
  authenticate: (salt, plainText, hashedPassword) => {
    return User.encryptPassword(salt, plainText) === hashedPassword;
  },

  /**
   * Make salt
   *
   * @return {String}
   */
  makeSalt: () => {
    return crypto.randomBytes(config.crypto.saltByteSize).toString('base64');
  },

  /**
   * Encrypt password
   *
   * @param {String} salt
   * @param {String} password
   * @return {String}
   */
  encryptPassword: (salt, password) => {
    if (!password){
      throw new Error('encryptPassword() No password specified!');
    }

    if (!salt){
      throw new Error('encryptPassword() No salt specified!');
    }

    const saltBuffer = new Buffer.from(salt, 'base64');

    return crypto.pbkdf2Sync(password, saltBuffer, config.crypto.iterations, config.crypto.hashByteSize, 'sha512').toString('base64');
  },

  /**
   * Create token for password reset or delete user link
   *
   * @return {object} Hash Object
   */
  createGenericToken: () => {
    return crypto.createHash('sha256').update(User.makeSalt()).digest('hex');
  },

  updatePassword: (userId, hashedPassword, newSalt, cn) => {
    if ((!userId) || (userId.length === 0)) {
      return Promise.reject(new Error('updatePassword() No userId specified!'));
    }
    if ((!hashedPassword) || (hashedPassword.length === 0)) {
      return Promise.reject(new Error('updatePassword() No hashedPassword specified!'));
    }
    if ((!newSalt) || (newSalt.length === 0)) {
      return Promise.reject(new Error('updatePassword() No newSalt specified!'));
    }
    const updateUserSql = 'UPDATE users SET reset_key = null, hashed_password = ?, salt = ? WHERE id = ?';
    const updateUserSqlParams = [hashedPassword, newSalt, userId];
    return db.raw(updateUserSql, updateUserSqlParams);
  },


  findByResetKey: (resetKey) => {
    if ((!resetKey) || (resetKey.length === 0)) {
      return Promise.reject(new Error('findByResetKey() No resetKey specified!'));
    }
    const userSql = 'SELECT * FROM users WHERE reset_key = ? LIMIT 1';
    return db.raw(userSql, [resetKey]).then((userSqlResults) => {
      return(objectToCamelCase(userSqlResults[0][0]));
    });
  },

  updateResetKey: (userId, resetKey) => {
    if ((!userId) || (userId.length === 0)) {
      return Promise.reject(new Error('updateResetKey() No userId specified!'));
    }
    if ((!resetKey) || (resetKey.length === 0)) {
      return Promise.reject(new Error('updateResetKey() No resetKey specified!'));
    }
    const updateUserSql = 'UPDATE users SET reset_key = ? WHERE id = ?';
    const updateUserSqlParams = [resetKey, userId];
    return db.raw(updateUserSql, updateUserSqlParams);
  },

  cleanUsersData: (usersArr) => {
    return _.map(usersArr, (ul) => {
      return User.cleanUserData(ul);
    });
  },

  cleanUserData: (userObj) => {
    const cleanedUser = _.merge({},userObj);

    delete cleanedUser.hashedPassword;
    delete cleanedUser.salt;

    return objectToCamelCase(cleanedUser);
  }
};

export default User;
