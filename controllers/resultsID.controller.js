'use strict'; 

import {connectedToApi, connectedToDatabase} from "../models/healthCheck.model.js"
import agingResult from "../models/agingResult.model.js"; 
import agingDocument from "../models/agingDocument.model.js";
import user from "../models/user2.model.js"; 
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const admZip = require('adm-zip')


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


async function checkConnection() {
    const connectedToApiResult = connectedToApi(); 
    const connectedToDatabaseResult = await connectedToDatabase(); 
    return connectedToApiResult && connectedToDatabaseResult; 
}


async function getResultDoc(req) {
    if (checkConnection) {
        const result = await agingResult.findById(req.params.resultID);
        const realDocID = result.agingDocument;   

        if (realDocID != req.params.docID) {
            return "ERROR: Requested docID does not match requested resultID"; 
        }
        const agingDoc = await agingDocument.findById(realDocID);
        const foundUser = await user.findById(agingDoc.userId)

        if (foundUser.email != req.params.email) {
            return "ERROR: requested result does not belong to user with given email"; 
        }
        return result 

}
}

//Connect to april age db and retrieve result with the given ID
    export const getResult = async(req, res, next)=> {
        try {

            const result = await getResultDoc(req)
            if (req.params.resultID.includes(".zip")) {
                
                var zip = new admZip();
                zip.addFile("results.json", new Buffer(JSON.stringify(result)));
                var zipResult = zip.toBuffer(); 
                res.setHeader("Content-Type", "application/zip");
                return res.send(zipResult) 
            }

            else {
                res.setHeader("Content-Type", "application/json");
                return res.send(result) 
            }            
            

        } catch(err) { next(err); }
    }

    //getResult and return it as a zip compressed file
    export const getResultZip = async(req, res, next)=> {

        try {
            const result = await getResultDoc(req)
            const zip = new JSZip(result, {base64: false, checkCRC32: true});
            res.setHeader("Content-Type", "application/zip");
            console.log("ZIP", zip)
            res.send(zip)
        }
        catch(err) {next(err); }
    }; 

    //find result with ID resultID in the db and delete it
    export const deleteResult = async(req, res, next)=> {
        try {
            if (checkConnection) {
                const result = await agingResult.findById(req.params.resultID);
                const realDocID = result.agingDocument;   
        
                if (realDocID != req.params.docID) {
                    return "ERROR: Requested docID does not match requested resultID"; 
                }
                const agingDoc = await agingDocument.findById(realDocID);
                const foundUser = await user.findById(agingDoc.userId)
        
                if (foundUser.email != req.params.email) {
                    return "ERROR: requested result does not belong to user with given email"; 
                }

                const success = await agingResult.deleteById(req.params.resultID); 
                res.send(success); 
        } 
    }
    catch(err) { next(err); }
    }
