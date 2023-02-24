const {
  authentificateUser,
  authPermition,
} = require('../middleware/authentication');
const express = require('express');
const router = express.Router();

const {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
} = require('../constrollers/order');

router
  .route('/')
  .post(authentificateUser, createOrder)
  .get(authentificateUser, authPermition('admin'), getAllOrders);
router.route('/showAllMyOrders').get(authentificateUser, getCurrentUserOrders);
router
  .route('/:id')
  .get(authentificateUser, getSingleOrder)
  .patch(authentificateUser, updateOrder);

module.exports = router;
