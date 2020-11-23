'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from './base.model.js';

const User2 = {
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
    const fields = ['email', 'first_name', 'last_name', 'hashed_password'];
    const values = ['?', '?', '?', '?'];
    const userInsertSqlParams = [
      //userObj.role,
      userObj.email,
      userObj.first_name,
      userObj.last_name,
      //userObj.salt,
      userObj.hashed_password
    ];

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
          return User2.findById(userId, trx);
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
  }
};

export default User2;
