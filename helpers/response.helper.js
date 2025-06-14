const ApiError = require('./error.helper');

const successResponse = (res, status, data, message) => {
  res.status(status).json({
    success: true,
    message,
    data,
  });
};

const errorResponse = (res, error) => {
  const status = error.statusCode || 500;
  const message = error.message || 'Internal Server Error';
  
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  res.status(status).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
  });
};

const catchAsync = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch((err) => {
    if (!(err instanceof ApiError)) {
      err = new ApiError(err.statusCode || 500, err.message);
    }
    errorResponse(res, err);
  });
};

module.exports = {
  successResponse,
  errorResponse,
  catchAsync,
};