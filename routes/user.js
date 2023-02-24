const {
  authentificateUser,
  authPermition,
} = require('../middleware/authentication');
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
} = require('../constrollers/user');

const express = require('express');
const router = express.Router();
router.get('/', authentificateUser, authPermition('admin'), getAllUsers);
router.get('/showMe', authentificateUser, showCurrentUser);
router.patch('/updateUser', authentificateUser, updateUser);
router.patch('/updateUserPassword', authentificateUser, updateUserPassword);
router.get('/:id', authentificateUser, getSingleUser);
module.exports = router;
