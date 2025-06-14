const Role = require('../models/Role.model');
const ApiError = require('../helpers/error.helper');

const createRole = async (roleBody) => {
  if (await Role.isNameTaken(roleBody.name)) {
    throw new ApiError(400, 'Role name already taken');
  }
  const role = await Role.create(roleBody);
  return role;
};

const getRoleById = async (id) => {
  const role = await Role.findById(id);
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }
  return role;
};

const getAllRoles = async () => {
  const roles = await Role.find();
  return roles;
};

const updateRoleById = async (roleId, updateBody) => {
  const role = await getRoleById(roleId);
  
  if (updateBody.name && (await Role.isNameTaken(updateBody.name, roleId))) {
    throw new ApiError(400, 'Role name already taken');
  }

  Object.assign(role, updateBody);
  await role.save();
  return role;
};

const deleteRoleById = async (roleId) => {
  const role = await getRoleById(roleId);
  await role.remove();
};

const assignRoleToUser = async (userId, roleName) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, 'User not found');
  }

  const role = await Role.findOne({ name: roleName });
  if (!role) {
    throw new ApiError(404, 'Role not found');
  }

  user.role = roleName;
  await user.save();
  return user;
};

module.exports = {
  createRole,
  getRoleById,
  getAllRoles,
  updateRoleById,
  deleteRoleById,
  assignRoleToUser,
};