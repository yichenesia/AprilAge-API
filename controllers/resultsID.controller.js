'use strict'; 

import {connectedToApi, connectedToDatabase} from '..models/documents.models.js';

// /results/{resultsID}, specific results ID 
// GET retrieves an aging result corresponding to the given id from /results
    // If the resultsID given does not belong to the logged in user, ERROR 403
    // If no aging result found, ERROR 404 
    // Else, status 200, content-type = application/json as Aging Result Representation 
// GET results/{resultsID}.zip, retrieves aged images as zip file from /results
    //Guest, User and Admin are allowed to access this
    //Error 401 if user is not authorized to access
    //Error 403 is aging result does not belong to the user
    //Error 404 if aging result is not found
    //else, status 200, application/zip
// DELETE remvoes an aging result at /results/{resultsID}
     //Guest, User and Admin are allowed to access this
    //Error 401 if user is not authorized to access
    //Error 403 is aging result does not belong to the user
    //Error 404 if aging result is not found
    //else, status 200, no content to return 


//Connect to april age db and retrieve result with the given ID
    export const getResult = async(req, res, next)=> {

    }

    //getResult and return it as a zip compressed file
    export const getResultZip = async(req, res, next)=> {

    }

    //find result with ID resultID in the db and delete it
    export const deleteResult = async(req, res, next)=> {

    }
