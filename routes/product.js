const {
  authentificateUser,
  authPermition,
} = require('../middleware/authentication');
const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProductReviews,
} = require('../constrollers/product');
const express = require('express');
const router = express.Router();
router
  .route('/')
  .post([authentificateUser, authPermition('admin')], createProduct)
  .get(getAllProducts);
router
  .route('/uploadImage')
  .post([authentificateUser, authPermition('admin')], uploadImage);
router
  .route('/:id')
  .patch([authentificateUser, authPermition('admin')], updateProduct)
  .delete([authentificateUser, authPermition('admin')], deleteProduct)
  .get(getSingleProduct);
router.route('/:id/reviews').get(getSingleProductReviews);
module.exports = router;
