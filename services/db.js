/*jslint node: true */

import config from '../config/config.js';
import logger from './logger.service.js';
import knexLib from 'knex';

const knex = knexLib({
  client: config.database.client,
  connection: config.database.connection
});

if (config.database.debugSQL === true) {
  knex.on( 'query', ( queryData ) => {
    if ((queryData.bindings) && ((queryData.bindings).length > 0)) {
      logger.debug('%s:\n%s\n', queryData.sql, JSON.stringify(queryData.bindings, null, 2) );
    } else {
      logger.debug('%s:\n', queryData.sql );
    }
  });
}
let versionStr = '';
knex.raw('SHOW VARIABLES LIKE "version_comment"').then((rows) => {
  versionStr = rows[0][0].Value;

  knex.raw('SHOW VARIABLES LIKE "version"').then((rows) => {
    versionStr = versionStr + ' ' + rows[0][0].Value;
    logger.info('MySQL Version:           ' + versionStr);
    logger.info('MySQL DB:                ' + config.database.connection.database);
    logger.info('DB host:                 ' + config.database.connection.host);
    logger.info('DB port:                 ' + config.database.connection.port);

    knex.raw('SHOW VARIABLES LIKE "innodb_file_per_table%"').then((rows) => {
      logger.info('innodb_file_per_table:   ' + rows[0][0].Value);

      knex.raw('SHOW VARIABLES LIKE "innodb_file_format%"').then((rows) => {
        //logger.info('innodb_file_format:      ' + rows[0][0].Value);
      });
    });
  });
});

export default knex;
