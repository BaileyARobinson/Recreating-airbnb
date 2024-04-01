// backend/utils/validation.js
const { validationResult } = require('express-validator');
const { check } = require('express-validator');


// middleware for formatting errors from express-validator middleware
// (to customize, see express-validator's documentation)
const handleValidationErrors = (req, _res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.path] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

const validateCreateSpot = [
  check('address')
    .exists({ checkFalsy: true })
    .isString()
    .withMessage('Street address is required'),
  check('city')
    .exists({ checkFalsy: true })
    .withMessage('city is required'),
  check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
  check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
  check('lat')
      .exists({ checkFalsy: true })
      .isFloat({
          min: -90,
          max: 90,
      })
      .withMessage('Latitude must be within -90 and 90'),
  check('lng')
      .exists({ checkFalsy: true })
      .isFloat({
          min: -180,
          max: 180,
      })
      .withMessage('Longitude must be within -180 and 180'),
  check('name')
      .exists({ checkFalsy: true })
      .isLength({ max: 50})
      .withMessage('Name must be less than 50 characters'),
  check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
  check('price')
      .exists({ checkFalsy: true })
      .isInt({ min : 0 })
      .withMessage('Price per day must be a positive number'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors, validateCreateSpot
};
