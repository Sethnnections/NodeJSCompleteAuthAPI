const { roleRights } = require('../config/roles');
const ApiError = require('../helpers/error.helper');

const checkPermissions = (requiredRights) => (req, res, next) => {
  const userRights = roleRights.get(req.user.role) || [];
  const hasRequiredRights = requiredRights.every((requiredRight) =>
    userRights.includes(requiredRight)
  );

  if (!hasRequiredRights && req.user.id !== req.params.userId) {
    throw new ApiError(403, 'Forbidden - Insufficient permissions');
  }
  next();
};

module.exports = checkPermissions;