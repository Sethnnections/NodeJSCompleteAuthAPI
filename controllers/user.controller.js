const userService = require('../services/user.service');
const { catchAsync } = require('../helpers/response.helper');

const getAllUsers = catchAsync(async (req, res) => {
  const users = await userService.getAllUsers({}, req.query);
  successResponse(res, 200, users, 'Users retrieved successfully');
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  successResponse(res, 200, user, 'User retrieved successfully');
});

const updateUser = catchAsync(async (req, res) => {
  const user = await userService.updateUserById(req.params.userId, req.body);
  successResponse(res, 200, user, 'User updated successfully');
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  successResponse(res, 200, null, 'User deleted successfully');
});

const activateUser = catchAsync(async (req, res) => {
  const user = await userService.activateUser(req.params.userId);
  successResponse(res, 200, user, 'User activated successfully');
});

const suspendUser = catchAsync(async (req, res) => {
  const user = await userService.suspendUser(req.params.userId);
  successResponse(res, 200, user, 'User suspended successfully');
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  activateUser,
  suspendUser,
};