const { errorResponse } = require('../helpers/response.helper');
const logger = require('../utils/logger');
const ApiError = require('../helpers/error.helper');
/**
 * Error handling middleware for Express.js applications.
 * It logs the error stack and sends a standardized error response.
 * If the response headers have already been sent, it passes the error to the next middleware.
 * 
 * @param {Error} err - The error object
 * @param {Object} req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  logger.error(err.stack);
  errorResponse(res, err);
};

const notFoundHandler = (req, res, next) => {
  errorResponse(res, new ApiError(404, 'Not found'));
};

module.exports = {
  errorHandler,
  notFoundHandler,
};