'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from './base.model.js';

const Image = {
  findById: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('findById() No id specified!'));
    }

    const sql = 'SELECT image.* FROM image WHERE id = ?';

    return cn.raw(sql, [id]).then((sqlResults) => {
      return(objectToCamelCase(sqlResults[0][0]));
    });
  },

  findByUri: (uri, cn = db) => {
    if ((!uri) || (uri.length === -1)) {
      return Promise.reject(new Error('findImageByUri() No uri specified!'));
    }

    const sql = 'SELECT * FROM image WHERE uri = ? LIMIT 1';

    return cn.raw(sql, [uri]).then((sqlResults) => {
      return(objectToCamelCase(sqlResults[0][0]));
    });
  },

  deleteById: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('deleteById() No id specified!'));
    }

    const deleteSql = 'DELETE FROM image WHERE id = ?';
    return cn.raw(deleteSql, [id]);
  },

  deleteByUri: (uri, cn) => {
    if ((!uri) || (uri.length === 0)) {
      return Promise.reject(new Error('deleteByUri() No uri specified!'));
    }

    const sql = 'DELETE FROM image WHERE uri = ?';
    return db.raw(sql, [uri]);
  },

  create: (imageObj, cn = db) => {
    const fields = ['uri'];
    const values = ['?'];
    const imageInsertSqlParams = [
      imageObj.uri
    ];

    const imageInsertSql = 'INSERT INTO image (' + fields + ') VALUES(' + values + ')';

    return cn.transaction((trx) => {
      return trx.raw(imageInsertSql, imageInsertSqlParams)
      .then((imageInsertSqlResults) => {
        return imageInsertSqlResults[0].insertId;
      }).catch((err) => {
        return trx.rollback(err).then(() => {
          return Promise.reject(err);
        });
      });
    });
  },

  updateById: (imageId, imageObj) => {
    return db.transaction((trx) => {
      return db('image').transacting(trx).update(imageObj).where('id',imageId)
        .then((results) => {
          return Image.findById(imageId, trx);
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

export default Image;
