const roles = ['USER', 'ADMIN', 'BUYER', 'SELLER', 'MODERATOR'];

const roleRights = new Map();
roleRights.set(roles[0], ['getUsers', 'manageSelf']);
roleRights.set(roles[1], ['getUsers', 'manageUsers', 'manageRoles']);
roleRights.set(roles[2], ['getProducts', 'manageCart']);
roleRights.set(roles[3], ['manageProducts']);
roleRights.set(roles[4], ['manageContent']);

module.exports = {
  roles,
  roleRights,
};