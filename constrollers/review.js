const { StatusCodes } = require('http-status-codes');
const { NotFoundError } = require('../errors');
const Review = require('../models/review');
const { checkPermisions } = require('../utils');
const createReview = async (req, res) => {
  const { product: productId } = req.body;
  req.body.user = req.user.userId;
  const review = await Review.create(req.body);
  res.status(StatusCodes.CREATED).json({ review });
};
const getAllReviews = async (req, res) => {
  const reviews = await Review.find().populate({
    path: 'product',
    select: 'name company price',
  });
  if (reviews.length === 0) throw new NotFoundError(`No reviews found`);
  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};
const getSingleReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review)
    throw new NotFoundError(`Cannot find review with id: ${req.params.id}`);
  res.status(StatusCodes.OK).json({ review });
};
const updateReview = async (req, res) => {
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: req.params.id });
  if (!review)
    throw new NotFoundError(`Cannot find review with id: ${req.params.id}`);
  checkPermisions(req.user, review.user);

  review.rating = rating;
  review.title = title;
  review.comment = comment;
  await review.save();

  res.status(StatusCodes.OK).json({ review });
};
const deleteReview = async (req, res) => {
  const review = await Review.findOne({ _id: req.params.id });
  if (!review)
    throw new NotFoundError(`Cannot find review with id: ${req.params.id}`);
  checkPermisions(req.user, review.user);
  await review.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success. Review removed' });
};

module.exports = {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
};
