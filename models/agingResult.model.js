'use strict';

import db from '../services/db.js';
import _ from 'lodash';
import { objectToCamelCase } from './base.model.js';

const AgingResult = {
  findById: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('findById() No id specified!'));
    }

    const sql = 'SELECT agingResult.* FROM agingResult WHERE id = ?';

    return cn.raw(sql, [id]).then((sqlResults) => {
      return(objectToCamelCase(sqlResults[0][0]));
    });
  },
  
  findByDOCId: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('findById() No id specified!'));
    }

    const sql = 'SELECT agingResult.* FROM agingResult WHERE id = ? and id = agingResult.agingDocument';

    return cn.raw(sql, [id]).then((sqlResults) => {
      //console.log(objectToCamelCase(sqlResults));
      return(objectToCamelCase(sqlResults[0]));
    });
  },

  deleteById: (id, cn = db) => {
    if ((!id) || (id.length === 0)) {
      return Promise.reject(new Error('deleteById() No id specified!'));
    }

    const deleteSql = 'DELETE FROM agingResult WHERE id = ?';
    return cn.raw(deleteSql, [id]);
  },

  create: (agingResultObj, cn = db) => {
    const fields = ['sequenceID', 'agingDocument'];
    const values = ['?', '?'];
    const agingResultInsertSqlParams = [
        agingResultObj.sequenceID,
        agingResultObj.agingDocument
    ];

    if ((agingResultObj.sequenceType) && (agingResultObj.sequenceType.length > 0)) {
        fields.push('sequenceType');
        values.push('?');
        agingResultInsertSqlParams.push(agingResultObj.sequenceType);
    }

    const agingResultInsertSql = 'INSERT INTO agingResult (' + fields + ') VALUES(' + values + ')';

    return cn.transaction((trx) => {
      return trx.raw(agingResultInsertSql, agingResultInsertSqlParams)
      .then((agingResultInsertSqlResults) => {
        return agingResultInsertSqlResults[0].insertId;
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

export default AgingResult;
