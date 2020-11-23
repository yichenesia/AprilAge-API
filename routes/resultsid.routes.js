'use strict';

import connectNoCache from 'connect-nocache';

import * as resultsID from '../controllers/resultsID.controller.js';
import {passportAuth} from '../middleware/auth.middleware.js';

const noCache = connectNoCache();

const routes = (router) => {
    router.route('/users/:email/documents/:docID/results/:resultID')
    .get(resultsID.getResult);

    // router.route('/users/:email/documents/:docID/results/:resultID.zip')
    // .get(resultsID.getResultZip);

    router.route('/users/:email/documents/:docID/results/:resultID')
    .delete(resultsID.deleteResult)

}

export default routes; 