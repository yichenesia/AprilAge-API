'use strict'; 

import {connectedToApi, connectedToDatabase} from "../models/status.model.js"
import agingResult from "../models/agingResult.model.js"; 
import agingDocument from "../models/agingDocument.model.js";
import user from "../models/user2.model.js"; 
import { createRequire } from "module";
//import { response } from "express";

const require = createRequire(import.meta.url);
const admZip = require('adm-zip')


async function checkConnection() {
    const connectedToApiResult = connectedToApi(); 
    const connectedToDatabaseResult = await connectedToDatabase(); 
    return connectedToApiResult && connectedToDatabaseResult; 
}


async function getResultDoc(req) {
    if (checkConnection) {
        const result = await agingResult.findById(req.params.resultID);

        if (result == undefined) {
            return 404
        }

        const realDocID = result.agingDocument;   

        if (realDocID != req.params.docID) {
            return 405; 
        }
        const agingDoc = await agingDocument.findById(realDocID);
        const foundUser = await user.findById(agingDoc.userId)

        if (foundUser.email != req.params.email) {
            return 406; 
        }
        return result 

}

else {
    return 503
}

}

//Connect to april age db and retrieve result with the given ID
    export const getResult = async(req, res, next)=> {
        try {

            const result = await getResultDoc(req)

            if (result == 404) {
                res.status(404); 
                return res.send("Error, result not found")
            }

            else if (result == 405) {
                res.status(400); 
                return res.send("ERROR: Requested docID does not match requested resultID"); 
            }

            else if (result == 406) {
                res.status(400);
                return res.send("ERROR: requested result does not belong to user with given email"); 
            }

            else if (result == 500) {
                res.status(500); 
                return res.send("Couldn't connect to API or Database")
            }
 
            //for /results/resultID.zip
            if (req.params.resultID.includes(".zip")) {
                
                var zip = new admZip();
                zip.addFile("results.json", new Buffer(JSON.stringify(result)));
                var zipResult = zip.toBuffer(); 
                res.setHeader("Content-Type", "application/zip");
                res.status(200); 
                return res.send(zipResult) 
            }

            else {
                res.status(200); 
                res.setHeader("Content-Type", "application/json");
                return res.send(result) 
            }            
            
        } catch(err) { next(err); }
    } 

    export const deleteResult = async(req, res, next)=> {
        try {
            if (checkConnection) {
                const result = await agingResult.findById(req.params.resultID);

                if (result == undefined) {
                    res.status(404); 
                    return res.send("Error, result does not exist."); 
                }

                const realDocID = result.agingDocument;   
        
                if (realDocID != req.params.docID) {
                    res.status(400)
                    return res.send("ERROR: Requested docID does not match requested resultID"); 
                }
                const agingDoc = await agingDocument.findById(realDocID);
                const foundUser = await user.findById(agingDoc.userId)
        
                if (foundUser.email != req.params.email) {
                    res.status(400)
                    return res.send("ERROR: requested result does not belong to user with given email"); 
                }

                const success = await agingResult.deleteById(req.params.resultID); 
                if (typeof success === "Promise") {
                    res.status(404)
                    return res.send(success); 
                }
                else {return res.send("Successfully deleted result")}
                
        } else {
            res.status(500);
            return res.send("Couldn't connect to API and/or database")
        }
    }
    catch(err) { next(err); }
    }
