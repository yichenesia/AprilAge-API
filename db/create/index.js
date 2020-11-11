

const fs = require('fs');
var mysql = require('mysql');

const dataSql = fs.readFileSync('./CreateDB.sql').toString();



var connection = mysql.createConnection({
    host: process.env.API_MYSQL_HOST,
    user: process.env.API_MYSQL_USER,
    password: process.env.API_MYSQL_PASSWORD,
    multipleStatements: true
});


exports.handler = (event, context, callback) => {

    const createSQL = "CREATE DATABASE " + process.env.API_MYSQL_DATABASE + 
                 "; USE " + process.env.API_MYSQL_DATABASE +   ";"
                 + dataSql.toString();

    connection.query(createSQL, function (error, results, fields) {
        if (error) {
            connection.destroy();
            throw error;
        } else {
            // connected!
            callback(error, results);
            connection.end(function (err) { callback(err, results);});
        }
    });
};
