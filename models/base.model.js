/*jslint node: true */
'use strict';

import decamelize from 'decamelize';
import camelcase from 'camelcase';

/// HELPERS
// returns the columns array to an objects with keys being the entries in the column, set to true.
const columnsArrayToObject = (columnsArray) => {
  return columnsArray.reduce((result, val) => { 
    result[val]=true; 
    return result;
  }, {});
}

// goes through an array of objects, and returns keys that are included in every object in the array.
const getKeysInAllObjects = (values, additionalKeysToFilter) => {
  const filterValues = additionalKeysToFilter ? [ columnsArrayToObject(additionalKeysToFilter), ...values] : [...values];
  return filterValues.reduce((results, val, index) => {
    if(index === 0) {
      // start with the keys of the first object.
      return Object.keys(val);
    } else {
      return results.filter((result) => { 
        return typeof(val[result]) !== 'undefined'; 
      });
    }
  }, []);
};

const filterColumns = (values, columns) => {
  return getKeysInAllObjects(values, columns);
};

// Values = values to filter, removing value keys that are not present in all values, or not present in the additional columns filter.
// addtionalColumnsToFilter = an array of column names.
const filterValues = (values, additionalColumnsToFilter) => {
// values are an array of objects, which contain the columns.
  const keysInAllObjects = getKeysInAllObjects(values, additionalColumnsToFilter);

  return values.map((value) => {
    return keysInAllObjects.reduce((result, keyInAllObjects) => {
      result[keyInAllObjects] = value[keyInAllObjects];

      return result;
    }, {});
  });  
};

// tableName is the name of the table.
// columns are the columns.
// upsertColumns are the upsert columns
// values = array of Values.
export const upsert = ({tableName, columns, upsertColumns, filterMissingValues = true }, values, trx) => {
  const upsertSqlPrefix = `INSERT INTO ?? ( ?? ) VALUES `;

  // By default, Filter columns and values, so that they only include those columns in which all values have that column
  const filteredColumns =  filterMissingValues ? filterColumns(values, columns) : columns;
  const filteredUpsertColumns = filterMissingValues ? filterColumns(values, upsertColumns) : upsertColumns;
  const filteredValues = filterMissingValues ? filterValues(values, columns) : values;

  const variableSql = ` ( ${filteredColumns.map(() => { return '?' }).join(', ')} )`; 
  const upsertSqlValuePart = filteredValues.map((t) => { return variableSql }).join(', ');

  const upsertColumnsToSqlFragments = filteredUpsertColumns.map((uc) => { return `${decamelize(uc)}=VALUES(${decamelize(uc)})`; }).join(`, `);
  let upsertSql = (filteredUpsertColumns && filteredUpsertColumns.length) ? ` ON DUPLICATE KEY UPDATE ${upsertColumnsToSqlFragments}` : ``;
  
  let upsertVariables = [tableName, filteredColumns.map((c) => { return decamelize(c); })];

  // create the translation part of the category
  upsertVariables = upsertVariables.concat(filteredValues.map( 
    (translation) => {
      return filteredColumns.map((c) => { return typeof(translation[c]) !== 'undefined' ? translation[c] : null; });
    }).flat(1));

  const finalUpsertSql = `${upsertSqlPrefix}${upsertSqlValuePart}${upsertSql}`;

   if (!values || values.length === 0) {
     return Promise.resolve({
      ids: [],
      results:[[]],
     });
   }

  return trx.raw(finalUpsertSql, upsertVariables)
    .then((sqlResults) => {
      const finalSqlResults = Array.isArray(sqlResults[0]) ? sqlResults[0] : [sqlResults[0]];

      return {
        ids: finalSqlResults.map((sr) => {  return sr.insertId ? sr.insertId : sr.id; }),
        results: sqlResults
      };
    });
};

export const objectToSnakeCase = (obj) => {
  if (!obj) {
    return obj;
  }

  return Object.keys(obj).reduce((result, k) => {
    result[decamelize(k)] = obj[k]; 
    
    return result;
  }, {});
};

export const objectsToSnakeCase = (results) => {
  return results.map((result) => { return objectToSnakeCase(result); });
};

export const objectToCamelCase = (obj) => {
  if (!obj) {
    return obj;
  }

  return Object.keys(obj).reduce((result, k) => {
    result[camelcase(k)] = obj[k]; 
    
    return result;
  }, {});
};

export const objectsToCamelCase = (results) => {
  return results.map((result) => { return objectToCamelCase(result); });
};
