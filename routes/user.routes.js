const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { auth } = require('../middlewares/auth.middleware'); 
const checkRole = require('../middlewares/role.middleware');
const { roles } = require('../config/roles');

router.get('/', auth, checkRole([roles.ADMIN]),userController.getAllUsers);
router.get('/:userId', auth, userController.getUser);
router.patch('/:userId', auth, userController.updateUser);
router.delete('/:userId', auth, checkRole([roles.ADMIN]), userController.deleteUser);
router.post('/:userId/activate', auth, checkRole([roles.ADMIN]), userController.activateUser);
router.post('/:userId/suspend', auth, checkRole([roles.ADMIN]), userController.suspendUser);

module.exports = router;