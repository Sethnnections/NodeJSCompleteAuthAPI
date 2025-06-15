const userService = require('../services/user.service');
const { catchAsync, successResponse } = require('../helpers/response.helper');

const getAllUsers = catchAsync(async (req, res) => {
  // Extract filter parameters
  const filter = {};
  
  // Add filtering logic based on query parameters
  if (req.query.search) {
    filter.$or = [
      { name: { $regex: req.query.search, $options: 'i' } },
      { email: { $regex: req.query.search, $options: 'i' } }
    ];
  }
  
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true';
  }
  
  if (req.query.role) {
    filter.role = req.query.role;
  }

  // Extract pagination and sorting options
  const options = {
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sort: {}
  };

  // Handle sorting
  if (req.query.sortBy) {
    const sortBy = req.query.sortBy;
    const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;
    options.sort[sortBy] = sortOrder;
  } else {
    options.sort.createdAt = -1; // Default sort by creation date
  }

  // If using mongoose-paginate-v2, you can also add:
  // options.select = 'name email isActive role createdAt'; // Select specific fields
  // options.populate = 'profile'; // Populate relationships if needed

  const users = await userService.getAllUsers(filter, options);
  
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

// Additional controller for getting user statistics
const getUserStats = catchAsync(async (req, res) => {
  const stats = {
    total: await userService.getUserCount(),
    active: await userService.getUserCount({ isActive: true }),
    suspended: await userService.getUserCount({ isActive: false }),
    admins: await userService.getUserCount({ role: 'ADMIN' }),
    users: await userService.getUserCount({ role: 'USER' })
  };
  
  successResponse(res, 200, stats, 'User statistics retrieved successfully');
});

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  activateUser,
  suspendUser,
  getUserStats,
};