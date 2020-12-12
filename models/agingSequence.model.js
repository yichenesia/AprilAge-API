'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from './base.model.js';

const AgingSequence = {
  findById: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('findById() No id specified!'));
    }

    const sql = 'SELECT agingSequence.* FROM agingSequence WHERE id = ?';

    return cn.raw(sql, [id]).then((sqlResults) => {
      return(objectToCamelCase(sqlResults[0][0]));
    });
  },

  deleteById: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('deleteById() No id specified!'));
    }

    const deleteSql = 'DELETE FROM agingSequence WHERE id = ?';
    return cn.raw(deleteSql, [id]);
  },

  create: (agingSeqObj, cn = db) => {
    const fields = [];
    const values = [];
    const agingSeqInsertSqlParams = [];

    if ((agingSeqObj.smoking) && (agingSeqObj.smoking.length > 0)) {
        fields.push('smoking');
        values.push('?');
        agingSeqInsertSqlParams.push(agingSeqObj.smoking);
    }
    if ((agingSeqObj.sunExposure) && (agingSeqObj.sunExposure.length > 0)) {
        fields.push('sunExposure');
        values.push('?');
        agingSeqInsertSqlParams.push(agingSeqObj.sunExposure);
    }
    if ((agingSeqObj.bmi) && (agingSeqObj.bmi.length > 0)) {
        fields.push('bmi');
        values.push('?');
        agingSeqInsertSqlParams.push(agingSeqObj.bmi);
    }
    if ((agingSeqObj.bmifunc) && (agingSeqObj.bmifunc.length > 0)) {
        fields.push('bmifunc');
        values.push('?');
        agingSeqInsertSqlParams.push(agingSeqObj.bmifunc);
    }
    if ((agingSeqObj.multiplier) && (agingSeqObj.multiplier.length > 0)) {
        fields.push('multiplier');
        values.push('?');
        agingSeqInsertSqlParams.push(agingSeqObj.multiplier);
    }
    if ((agingSeqObj.age) && (agingSeqObj.age > 0)) {
      fields.push('age');
      values.push('?');
      agingSeqInsertSqlParams.push(agingSeqObj.age);
    }

    const agingSeqInsertSql = 'INSERT INTO agingSequence (' + fields + ') VALUES(' + values + ')';

    return cn.transaction((trx) => {
      return trx.raw(agingSeqInsertSql, agingSeqInsertSqlParams)
      .then((agingSeqInsertSqlResults) => {
        return agingSeqInsertSqlResults[0].insertId;
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

export default AgingSequence;
