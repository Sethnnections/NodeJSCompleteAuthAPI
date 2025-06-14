const Joi = require('joi');
const ApiError = require('../helpers/error.helper');
const { catchAsync } = require('../helpers/response.helper');

const validate = (schema) => catchAsync(async (req, res, next) => {
  const validSchema = Joi.object(schema).unknown(true);
  const { value, error } = validSchema.validate(req, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(', ');
    throw new ApiError(400, errorMessage);
  }

  Object.assign(req, value);
  next();
});

module.exports = validate;