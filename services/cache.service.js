import nodeCache from 'node-cache';
import _ from 'lodash';

import logger from '../services/logger.service.js';
import { getScriptName } from '../utils/require.utils.js';

const scriptName = getScriptName(import.meta.url);

let config = {
  ttl : 15 * 60
};

let cache ;
export const init = (cacheConfiguration) => {
  return new Promise((resolve , reject) => {
    try {
      config = _.merge(config, cacheConfiguration);
      cache = new nodeCache({ stdTTL: config.ttl });
      resolve();
    }
    catch(exception){
      logger.error(scriptName, `couldn't initialize cache service : ` + JSON.stringify(exception ));
      reject(exception);
    }
  });
};

/**
 * Returns a promise that resolves into the value of that key in the cache if it exists
 * and is rejected if the key is not found, or there was an error
 * @param key
 */
export const get = (key,getKeyPromise) => {
  return new Promise((resolve, reject) => {
    cache.get(key, (err, value) => {
      if ( !err ) {
        if (value === undefined) {
          logger.debug(scriptName,'key : ' + key + ' not found in cache, resolving ' );

          Promise.resolve(getKeyPromise).then((newValue) => {
            // Don't wait for callback on set, because on 'get' we don't
            // explicitely care on a failure here, we should continue instead.
            // TODO: possibly handle the possible error, for logging.
            cache.set(key,newValue);
            resolve(newValue);
          }).catch((err) => {
            reject(err);
          });
        } else {
          resolve(value);
        }
      } else {
        reject(err);
      }
    });
  });
};

// gets cached.
// key is cache key
// callOnMissFunc is function to call
// paramsArray (optional) is params for callOnMissFunc
// thisForFunc (optional) is the this obj for function call;
export const getCachedOrCall = (key, callOnMissFunc, paramsArray, thisForFunc) => {
  paramsArray = paramsArray? paramsArray:[];
  thisForFunc = thisForFunc? thisForFunc: this;

  const callback = () => {
    return callOnMissFunc.apply(thisForFunc,paramsArray);
  };

  return exports.getCachedOrCallbackOnMiss(key, callback);
};

export const getCachedOrCallbackOnMiss = (key, promiseCallback) => {
  return exports.getCached(key).then((result) => {
    if(result === undefined) {
      throw new Error('Cache miss error');
    } else {
      return result;
    }
  }).catch((err) => {
    if(promiseCallback) {
      return promiseCallback()
        .then((result) => {
          cache.set(key,result);
          return result;
        });
    } else {
      return Promise.reject(err);
    }
  });
};


// Returns  of the value only if cached, does not try to resolve if cache is missed.
export const getCached = (key) => {
  return new Promise((resolve,reject) => {
    cache.get(key, (err, value) => {
      if( !err ) {
        resolve(value);
      } else {
        // reject normal err?
        reject(err);
      }
    });
  });
};

export const set = (key, value) => {
  return new Promise((resolve, reject) => {
    cache.set(key,value,config.ttl, (err, success) => {
      if( !err && success ) {
        resolve(value);
      }
      else {
        // reject normal err?
        reject(err);
      }
    });
  });
};
