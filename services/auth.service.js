const bcrypt = require('bcryptjs');
const { jwtConfig, generateToken } = require('../config/jwt');
const Token = require('../models/Token.model');
const User = require('../models/User.model');
const Session = require('../models/Session.model');
const { sendVerificationEmail, sendResetPasswordEmail } = require('../helpers/email.helper');
const ApiError = require('../helpers/error.helper');
const logger = require('../utils/logger');

const register = async (userData) => {
  if (await User.isEmailTaken(userData.email)) {
    throw new ApiError(400, 'Email already taken');
  }

  const user = await User.create(userData);
  const verifyToken = generateToken(
    { sub: user.id },
    jwtConfig.accessTokenSecret,
    jwtConfig.verifyEmailTokenExpiration
  );

  await Token.create({
    token: verifyToken,
    user: user.id,
    type: 'verifyEmail',
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  await sendVerificationEmail(user.email, verifyToken);
  return user;
};

const login = async (email, password, userAgent, ip) => {
  const user = await User.findOne({ email });
  
  if (!user || !(await user.isPasswordMatch(password))) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  if (!user.isActive) {
    throw new ApiError(401, 'Account is suspended');
  }

  const accessToken = generateToken(
    { sub: user.id, role: user.role },
    jwtConfig.accessTokenSecret,
    jwtConfig.accessTokenExpiration
  );

  const refreshToken = generateToken(
    { sub: user.id },
    jwtConfig.refreshTokenSecret,
    jwtConfig.refreshTokenExpiration
  );

  await Token.create([
    {
      token: accessToken,
      user: user.id,
      type: 'access',
      expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
    {
      token: refreshToken,
      user: user.id,
      type: 'refresh',
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  ]);

  await Session.create({
    user: user.id,
    accessToken,
    refreshToken,
    userAgent,
    ip,
  });

  return { user, tokens: { accessToken, refreshToken } };
};

const logout = async (accessToken) => {
  const tokenDoc = await Token.findOneAndDelete({ token: accessToken, type: 'access' });
  if (!tokenDoc) {
    throw new ApiError(404, 'Token not found');
  }
  await Session.findOneAndUpdate(
    { accessToken },
    { isValid: false }
  );
};

const refreshTokens = async (refreshToken) => {
  const refreshTokenDoc = await Token.findOne({
    token: refreshToken,
    type: 'refresh',
    blacklisted: false,
  });

  if (!refreshTokenDoc) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(refreshTokenDoc.user);
  if (!user) {
    throw new ApiError(401, 'User not found');
  }

  const newAccessToken = generateToken(
    { sub: user.id, role: user.role },
    jwtConfig.accessTokenSecret,
    jwtConfig.accessTokenExpiration
  );

  await Token.create({
    token: newAccessToken,
    user: user.id,
    type: 'access',
    expires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });

  await Session.findOneAndUpdate(
    { refreshToken },
    { accessToken: newAccessToken }
  );

  return { accessToken: newAccessToken };
};

const forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'Email not found');
  }

  const resetToken = generateToken(
    { sub: user.id },
    jwtConfig.accessTokenSecret,
    jwtConfig.resetPasswordTokenExpiration
  );

  await Token.create({
    token: resetToken,
    user: user.id,
    type: 'resetPassword',
    expires: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
  });

  await sendResetPasswordEmail(user.email, resetToken);
};

const resetPassword = async (token, newPassword) => {
  const tokenDoc = await Token.findOne({
    token,
    type: 'resetPassword',
    blacklisted: false,
  });

  if (!tokenDoc) {
    throw new ApiError(400, 'Invalid or expired token');
  }

  const user = await User.findById(tokenDoc.user);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.password = newPassword;
  await user.save();
  await Token.deleteMany({ user: user.id, type: 'resetPassword' });
};

const verifyEmail = async (token) => {
logger.info(`Verifying email with token: ${token}`);
  if (!token) {
    throw new ApiError(400, 'Token is required');
  }
  logger.info(`Token received for email verification: ${token}`);
  const tokenDoc = await Token.findOne({
    token,
    type: 'verifyEmail',
    blacklisted: false,
  });

  if (!tokenDoc) {
    throw new ApiError(400, 'Invalid or expired token');
  }

  const user = await User.findById(tokenDoc.user);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  user.isEmailVerified = true;
  await user.save();
  await Token.deleteMany({ user: user.id, type: 'verifyEmail' });
};

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};