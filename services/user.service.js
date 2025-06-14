const User = require('../models/User.model');
const ApiError = require('../helpers/error.helper');

const getAllUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};

const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }
  return user;
};

const updateUserById = async (userId, updateBody) => {
  const user = await getUserById(userId);
  
  if (updateBody.email && (await User.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(400, 'Email already taken');
  }

  Object.assign(user, updateBody);
  await user.save();
  return user;
};

const deleteUserById = async (userId) => {
  const user = await getUserById(userId);
  await user.remove();
};

const activateUser = async (userId) => {
  const user = await getUserById(userId);
  user.isActive = true;
  await user.save();
  return user;
};

const suspendUser = async (userId) => {
  const user = await getUserById(userId);
  user.isActive = false;
  await user.save();
  return user;
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  activateUser,
  suspendUser,
};