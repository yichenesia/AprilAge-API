// Update with your config settings.
require("dotenv").config({path: '../.env'});

module.exports = {
  client: 'mysql',
  migrations: {
    directory: './migrations'
  },
  connection: {
    host: process.env.API_MYSQL_HOST,
    port: process.env.API_MYSQL_PORT,
    database: process.env.API_MYSQL_DATABASE,
    user:     process.env.API_MYSQL_USER,
    password : process.env.API_MYSQL_PASSWORD,
    charset: 'utf8',
    multipleStatements: true
  },
  development: {
    client: 'mysql',
    connection: {
      host: process.env.API_MYSQL_HOST,
      port: process.env.API_MYSQL_PORT,
      database: process.env.API_MYSQL_DATABASE,
      user:     process.env.API_MYSQL_USER,
      password : process.env.API_MYSQL_PASSWORD,
      charset: 'utf8',
      multipleStatements: true
    },
  },
  staging: {
    client: 'mysql',
    connection: {
      host: process.env.API_MYSQL_HOST,
      port: process.env.API_MYSQL_PORT,
      database: process.env.API_MYSQL_DATABASE,
      user:     process.env.API_MYSQL_USER,
      password: process.env.ROOT_PASSWORD,
      charset: 'utf8',
      multipleStatements: true
    },
  },
  production: {
    client: 'mysql',
    connection: {
      host: process.env.API_MYSQL_HOST,
      port: process.env.API_MYSQL_PORT,
      database: process.env.API_MYSQL_DATABASE,
      user:     process.env.API_MYSQL_USER,
      password: process.env.ROOT_PASSWORD,
      charset: 'utf8',
      multipleStatements: true
    }
  }
};
