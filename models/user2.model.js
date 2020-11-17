/*jslint node: true */
'use strict';

import knex from '../services/db.js';

export const connectedToApi = () => {
  return true;
};

export const connectedToDatabase = () => {
  return knex.raw(
    'Select 1 as result'
  ).then((sqlResult) => {
    return (sqlResult[0][0].result === 1);
  }).catch(err => {
    console.log(err);
  });
};