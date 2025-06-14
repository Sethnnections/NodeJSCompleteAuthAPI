const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const jwtConfig = {
  accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'your-access-secret',
  refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'your-refresh-secret',
  accessTokenExpiration: '15m',
  refreshTokenExpiration: '7d',
  resetPasswordTokenExpiration: '10m',
  verifyEmailTokenExpiration: '24h',
};

const generateToken = (payload, secret, expiresIn) => {
  return jwt.sign(payload, secret, { expiresIn });
};

const verifyToken = (token, secret) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error('Token verification failed:', error);
    return null;
  }
};

module.exports = {
  jwtConfig,
  generateToken,
  verifyToken,
};