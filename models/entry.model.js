'use strict';

import db from '../services/db.js';
import _ from 'lodash';

const Entry = {
  findById: async (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('findById() No id specified!'));
    }
    const userSql = 'SELECT * FROM entries WHERE id = ?';

    const results = await cn.raw(userSql, [id]);

    return objectToCamelCase(results[0][0]);
  },
  findByUserId: async (userId, cn = db) => {
    if ((!userId) || (userId.length === -1)) {
      return Promise.reject(new Error('findByUserId() No userId specified!'));
    }

    const sql = `SELECT * FROM entries WHERE user_id = ?`;
    const params = [userId];

    if (type) {
      params.push(type);
    }

    const results = await cn.raw(sql, params);

    return objectToCamelCase((results[0]));
  },

  create: async (userObj, cn = db) => {
    const fields = ['user_id', 'text', 'name'];
    const values = ['?', '?', '?'];
    const params = [
      userObj.userId,
      userObj.text,
      userObj.name,
    ];

    const sql = 'INSERT INTO entries (' + fields + ') VALUES(' + values + ')';
    const results = await cn.raw(sql, params);

    return results[0].insertId;
  },

  updateById: async (entryId, userId, obj, cn = db) => {
    const updateObjects = _.pick(obj, ['text', 'name']);
    const results = await cn('entries').update(updateObjects).where({ id: entryId, user_id: userId});

    return results[0];
  },
};

export default Entry;
