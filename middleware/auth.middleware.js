import passport from 'passport';

import { Roles } from '../config/constants.js';

/// Check Admin
console.log("fgdhgj");
export const passportAuth = passport.authenticate('bearer', { session:false });
export const refreshPassportAuth = passport.authenticate('refresh-bearer', { session:false });

/// Check Admin
export const adminOnly = (req, res, next) => {

  if(req.user && req.user.role === Roles.admin) {
    next();
  } else {
    res.status(401).json({msg:"User must be admin"});
  }
};

export const adminOrUserOnly = (req, res, next) => {
  const userId = req.params.userId && parseInt(req.params.userId);
  if(req.user && (req.user.role === Roles.admin || req.user.id === userId) ) {
    next();
  } else {
    res.status(401).json({msg:"User must be an admin or the user"})
  }
}

/// Check if (req.user.id === userId) i.e. same as user being made request for?
export const sameUser = (req, res, next) => {
  const userId = req.params.userId && parseInt(req.params.userId);

  if (req.user.id === userId) {
    next();
  } else {
    res.status(401).json({msg:"User must be same as being made request for"});
  }
};
