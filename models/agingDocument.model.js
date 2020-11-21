'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from './base.model.js';

const AgingDocument = {
  findById: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('findById() No id specified!'));
    }

    const sql = 'SELECT agingDocument.* FROM agingDocument WHERE id = ?';

    return cn.raw(sql, [id]).then((sqlResults) => {
      return(objectToCamelCase(sqlResults[0][0]));
    });
  },

  deleteById: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('deleteById() No id specified!'));
    }

    const deleteSql = 'DELETE FROM agingDocument WHERE id = ?';
    return cn.raw(deleteSql, [id]);
  },

  create: (agingDocObj, cn = db) => {
    const fields = ['userId', 'originalImage'];
    const values = ['?', '?'];
    const agingDocInsertSqlParams = [
        agingDocObj.userId,
        agingDocObj.originalImage
    ];

    if ((agingDocObj.status) && (agingDocObj.status.length > 0)) {
        fields.push('status');
        values.push('?');
        agingDocInsertSqlParams.push(agingDocObj.status);
    }
    if ((agingDocObj.isSample) && (agingDocObj.isSample.length > 0)) {
        fields.push('isSample');
        values.push('?');
        agingDocInsertSqlParams.push(agingDocObj.isSample);
    }
    if ((agingDocObj.gender) && (agingDocObj.gender.length > 0)) {
        fields.push('gender');
        values.push('?');
        agingDocInsertSqlParams.push(agingDocObj.gender);
    }
    if ((agingDocObj.name) && (agingDocObj.name.length > 0)) {
        fields.push('name');
        values.push('?');
        agingDocInsertSqlParams.push(agingDocObj.name);
    }
    if ((agingDocObj.age) && (agingDocObj.age.length > 0)) {
        fields.push('age');
        values.push('?');
        agingDocInsertSqlParams.push(agingDocObj.age);
    }
    if ((agingDocObj.ethnicity) && (agingDocObj.ethnicity.length > 0)) {
        fields.push('ethnicity');
        values.push('?');
        agingDocInsertSqlParams.push(agingDocObj.ethnicity);
    }
    if ((agingDocObj.height) && (agingDocObj.height.length > 0)) {
        fields.push('height');
        values.push('?');
        agingDocInsertSqlParams.push(agingDocObj.height);
    }
    if ((agingDocObj.weight) && (agingDocObj.weight.length > 0)) {
        fields.push('weight');
        values.push('?');
        agingDocInsertSqlParams.push(agingDocObj.weight);
    }
    if ((agingDocObj.measurement) && (agingDocObj.measurement.length > 0)) {
        fields.push('measurement');
        values.push('?');
        agingDocInsertSqlParams.push(agingDocObj.measurement);
    }
    if ((agingDocObj.bounds) && (agingDocObj.bounds.length > 0)) {
        fields.push('bounds');
        values.push('?');
        agingDocInsertSqlParams.push(agingDocObj.bounds);
    }

    const agingDocInsertSql = 'INSERT INTO agingDocument (' + fields + ') VALUES(' + values + ')';

    return cn.transaction((trx) => {
      return trx.raw(agingDocInsertSql, agingDocInsertSqlParams)
      .then((agingDocInsertSqlResults) => {
        return agingDocInsertSqlResults[0].insertId;
      }).catch((err) => {
        return trx.rollback(err).then(() => {
          return Promise.reject(err);
        });
      });
    });
  },

  /*updateById: (imageId, imageObj) => {
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
  }*/
};

export default AgingDocument;
