const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth } = require('../middlewares/auth.middleware'); 
const checkRole = require('../middlewares/role.middleware');
const { roles } = require('../config/roles');

// Get all users with pagination, filtering, and sorting support
// Query params: ?page=1&limit=10&search=john&isActive=true&role=admin&sortBy=name&sortOrder=asc
router.get('/', auth, checkRole([roles.ADMIN]), userController.getAllUsers);

// Get user statistics (optional - add this route if you want stats)
router.get('/stats', auth, checkRole([roles.ADMIN]), userController.getUserStats);

// Get specific user by ID
router.get('/:userId', auth, userController.getUser);

// Update user
router.patch('/:userId', auth, userController.updateUser);

// Delete user
router.delete('/:userId', auth, checkRole([roles.ADMIN]), userController.deleteUser);

// Activate user
router.post('/:userId/activate', auth, checkRole([roles.ADMIN]), userController.activateUser);

// Suspend user
router.post('/:userId/suspend', auth, checkRole([roles.ADMIN]), userController.suspendUser);

module.exports = router;