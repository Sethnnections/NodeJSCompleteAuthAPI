const roleService = require('../services/role.service');
const { catchAsync } = require('../helpers/response.helper');

const createRole = catchAsync(async (req, res) => {
  const role = await roleService.createRole(req.body);
  successResponse(res, 201, role, 'Role created successfully');
});

const getAllRoles = catchAsync(async (req, res) => {
  const roles = await roleService.getAllRoles();
  successResponse(res, 200, roles, 'Roles retrieved successfully');
});

const getRole = catchAsync(async (req, res) => {
  const role = await roleService.getRoleById(req.params.roleId);
  successResponse(res, 200, role, 'Role retrieved successfully');
});

const updateRole = catchAsync(async (req, res) => {
  const role = await roleService.updateRoleById(req.params.roleId, req.body);
  successResponse(res, 200, role, 'Role updated successfully');
});

const deleteRole = catchAsync(async (req, res) => {
  await roleService.deleteRoleById(req.params.roleId);
  successResponse(res, 200, null, 'Role deleted successfully');
});

const assignRole = catchAsync(async (req, res) => {
  const { role } = req.body;
  const user = await roleService.assignRoleToUser(req.params.userId, role);
  successResponse(res, 200, user, 'Role assigned successfully');
});

module.exports = {
  createRole,
  getAllRoles,
  getRole,
  updateRole,
  deleteRole,
  assignRole,
};