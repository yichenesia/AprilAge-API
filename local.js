/*jslint node: true */

'use strict';


import runApp from './app.js';
import express from 'express';


const app = express();


runApp(app).then(({port, logger, config }) => {

    app.listen(port, () => {
       logger.info('%s API Server started on %d NODE_ENV=%s', config.api.name,  port, app.get('env'));
   });
  });

