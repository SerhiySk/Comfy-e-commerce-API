const {
  authentificateUser,
  authPermition,
} = require('../middleware/authentication');
const express = require('express');
const router = express.Router();

const {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} = require('../constrollers/review');

router.route('/').post(authentificateUser, createReview).get(getAllReviews);

router
  .route('/:id')
  .patch(authentificateUser, updateReview)
  .delete(authentificateUser, deleteReview)
  .get(getSingleReview);

module.exports = router;
