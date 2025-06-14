const authService = require('../services/auth.service');
const { catchAsync, successResponse} = require('../helpers/response.helper');

const register = catchAsync(async (req, res) => {
  const user = await authService.register(req.body);
  successResponse(res, 201, user, 'User registered successfully. Please check your email for verification.');
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.login(email, password, req.get('User-Agent'), req.ip);
  successResponse(res, 200, { user, tokens }, 'Login successful');
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.token);
  successResponse(res, 200, null, 'Logout successful');
});

const refreshTokens = catchAsync(async (req, res) => {
  const { refreshToken } = req.body;
  const tokens = await authService.refreshTokens(refreshToken);
  successResponse(res, 200, tokens, 'Tokens refreshed successfully');
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  await authService.forgotPassword(email);
  successResponse(res, 200, null, 'Password reset email sent');
});

const resetPassword = catchAsync(async (req, res) => {
  const { token } = req.query;
  const { password } = req.body;
  await authService.resetPassword(token, password);
  successResponse(res, 200, null, 'Password reset successful');
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;
  await authService.verifyEmail(token);
  successResponse(res, 200, null, 'Email verified successfully');
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  verifyEmail,
};