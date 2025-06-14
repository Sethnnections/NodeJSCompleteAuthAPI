const { jwtConfig, verifyToken } = require('../config/jwt');
const ApiError = require('../helpers/error.helper');
const Token = require('../models/Token.model');
const { catchAsync } = require('../helpers/response.helper');
const logger = require('../utils/logger');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      throw new ApiError(401, 'Authentication required');
    }

    const decoded = verifyToken(token, jwtConfig.accessTokenSecret);
    if (!decoded) {
      throw new ApiError(401, 'Invalid or expired token');
    }

    const tokenDoc = await Token.findOne({
      token,
      user: decoded.sub,
      type: 'access',
      blacklisted: false,
    });

    if (!tokenDoc) {
      throw new ApiError(401, 'Token not found');
    }

    req.user = decoded;
    req.token = token;
    next();
  } catch (error) {
    next(error);
  }
};

// Keep checkRole as is since it's not async
const checkRole = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    throw new ApiError(403, 'Forbidden - Insufficient permissions');
  }
  next();
};

module.exports = {
  auth,
  checkRole,
};