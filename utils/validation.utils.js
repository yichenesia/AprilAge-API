import expressValidator from 'express-validator';
const { validationResult } = expressValidator;

export const isInvalidValue = (param) => {
  if (typeof param === 'undefined') return true;
  if ((!param) || (param.length === 0)) return true;
  return false;
};

export const isValidValue = (param) => {
  if ((param) && (param.length > 0)) {
    return true;
  } else {
    return false;
  }
};

// can be reused by many routes
export const validate = validations => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(422).json({ errors: errors.array() });
  };
};