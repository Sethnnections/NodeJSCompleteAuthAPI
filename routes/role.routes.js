const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { auth } = require('../middlewares/auth.middleware'); 
const checkRole = require('../middlewares/role.middleware');
const { roles } = require('../config/roles');

router.post('/', auth, checkRole([roles.ADMIN]), roleController.createRole);
router.get('/', auth, checkRole([roles.ADMIN]), roleController.getAllRoles);
router.get('/:roleId', auth, checkRole([roles.ADMIN]), roleController.getRole);
router.patch('/:roleId', auth, checkRole([roles.ADMIN]), roleController.updateRole);
router.delete('/:roleId', auth, checkRole([roles.ADMIN]), roleController.deleteRole);
router.post('/:userId/assign', auth, checkRole([roles.ADMIN]), roleController.assignRole);

module.exports = router;