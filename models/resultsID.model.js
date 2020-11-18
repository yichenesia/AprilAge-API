'use strict'; 

import config from '../config/config.js'; 
import db from '../services/db.js';
import crypto from 'crypto'; 
import _ from 'lodash'; 
// import {objectToCamelCase} from '.base.model.js'
import knex from '../services/db.js';


export const connectedToApi = () => {
    return true; 
}; 

export const connectedToDatabase = () => {
    return knex.raw(
        "SELECT 1 AS RESULT;").then((sqlResult)=> {
            return (sqlResult[0][0].result === 1);
        }).catch(err => {
            console.log(err); 
        });
}