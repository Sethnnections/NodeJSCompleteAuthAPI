const User = require('../models/User.model');
const ApiError = require('../helpers/error.helper');

const getAllUsers = async (filter = {}, options = {}) => {
  // Default options
  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;
  
  // Get sort option
  const sort = options.sort || { createdAt: -1 };
  
  // Execute queries in parallel
  const [docs, totalDocs] = await Promise.all([
    User.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .exec(),
    User.countDocuments(filter)
  ]);
  
  // Calculate pagination info
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  
  return {
    docs,
    totalDocs,
    limit,
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
    nextPage: hasNextPage ? page + 1 : null,
    prevPage: hasPrevPage ? page - 1 : null,
    pagingCounter: skip + 1,
  };
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
  await user.deleteOne();
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

const getUserCount = async (filter = {}) => {
  return await User.countDocuments(filter);
};


module.exports = {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  activateUser,
  suspendUser,
  getUserCount,
};