/*jslint node: true */

'use strict';
import passportLocal from 'passport-local';
import passportHttpBearer from 'passport-http-bearer';
import config from './config.js';
import jwt from 'jsonwebtoken';
import userModel from '../models/user.model.js';
import refreshJwtModel from '../models/refreshJwt.model.js';
import logger from '../services/logger.service.js';

const LocalStrategy = passportLocal.Strategy;
const BearerStrategy = passportHttpBearer.Strategy;

const passportFunction = (passport) => {

  // Serialize the user id to push into the session
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  // Deserialize the user object based on a pre-serialized token
  // which is the user id
  passport.deserializeUser((id, done) => {
    userModel.findById(id).then((err, user) => {
      done(err, user);
    });
  });

  // Use local strategy
  passport.use('local-login', new LocalStrategy({
    // by default, local strategy uses username and password, we will override with email
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true // allows us to pass back the entire request to the callback
  }, (req, email, password, done) => {
    userModel.findByEmail(email).then((user) => {
      if ((!user) || ((user.deletedUser === 1))) {
        return done(null, false, { message: 'Unknown user' });
      }

      let isMatch = false;
      if ((user.salt) && (user.hashedPassword)){
        isMatch = userModel.authenticate(user.salt, password, user.hashedPassword);
      }
      if (!isMatch || (typeof (user.salt) === 'undefined') || (typeof (user.hashedPassword) === 'undefined')) {
        return done(null, false, { message: 'Invalid password' });
      }

      return done(null, user);
    });
  }));

  passport.use('refresh-bearer', new BearerStrategy(
    (token, done) => {
      try {
        jwt.verify(token, config.jwt.refreshSessionSecret, async (err, decoded) => {
          if (err) {
            /*
              err = {
                name: 'TokenExpiredError',
                message: 'jwt expired',
                expiredAt: 1408621000
              }
            */
            if (err.expiredAt) {
              logger.error(err.name + ': ' + err.message + ', expiredAt: ' + err.expiredAt);
            } else {
              logger.error(err.name + ': ' + err.message);
            }
            return done(null, false);
          }

          // auth Info data
          const authInfo = {
            refreshToken: token,
            exp: decoded.exp
          };


          try {
            const [ user, jwtRefreshResult ] = await Promise.all([
              userModel.findById(decoded.id),
              refreshJwtModel.findByUserIdAndRefreshToken(decoded.id, token)
            ]);

            if ((!user) || (user.deletedUser === 1)) {
              return done(null, false, authInfo); //no such user
            } else if (!jwtRefreshResult) {
              return done(null, false, authInfo); //no such user
            } else {
              return done(null, user, authInfo); //allows the call chain to continue to the intended route
            }
          } catch(err) {
            return done(null, false);
          };
        });
      } catch (err) {
        return done(null, false);
      }
    }
  ));

  passport.use(new BearerStrategy(
    (token, done) => {
      try {
        jwt.verify(token, config.jwt.sessionSecret, (err, decoded) => {
          if (err) {
            /*
              err = {
                name: 'TokenExpiredError',
                message: 'jwt expired',
                expiredAt: 1408621000
              }
            */
            if (err.expiredAt) {
              logger.error(err.name + ': ' + err.message + ', expiredAt: ' + err.expiredAt);
            } else {
              logger.error(err.name + ': ' + err.message);
            }
            return done(null, false);
          }
          userModel.findById(decoded.id).then((user) => {
            if ((!user) || (user.deletedUser === 1)) {
              return done(null, false); //no such user
            } else {
              return done(null, user); //allows the call chain to continue to the intended route
            }
          });
        });
      } catch (err) {
        return done(null, false);
      }
    }
  ));
};

export default passportFunction;
