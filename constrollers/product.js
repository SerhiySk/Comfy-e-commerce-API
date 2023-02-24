const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const Product = require('../models/product');
const Review = require('../models/review');
const path = require('path');

const createProduct = async (req, res) => {
  req.body.user = req.user.userId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};
const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products });
};
const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id }).populate(
    'reviews'
  );
  if (!product)
    throw new NotFoundError(`No product found with id: ${req.params.id}`);
  res.status(StatusCodes.OK).json({ product });
};
const updateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!product)
    throw new NotFoundError(`No product found with id: ${req.params.id}`);
  res.status(StatusCodes.OK).json({ product });
};
const deleteProduct = async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id });
  if (!product)
    throw new NotFoundError(`No product found with id: ${req.params.id}`);
  await product.remove();
  res.status(StatusCodes.OK).json({ msg: 'Success. Product removed' });
};
const uploadImage = async (req, res) => {
  const image = req.files.image;
  if (!image.mimetype.startsWith('image'))
    throw new BadRequestError('Only images can be uploaded');
  const maxsize = 1024 * 1024;
  if (image.size > maxsize)
    throw new BadRequestError('Image size cannot be more than 1MB');

  const imagePath = path.join(
    __dirname,
    '../public/uploads' + `/${image.name}`
  );
  await image.mv(imagePath);
  res.status(StatusCodes.OK).json({ image: `/uploads/${image.name}` });
};
const getSingleProductReviews = async (req, res) => {
  const reviews = await Review.find({ product: req.params.id });

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

module.exports = {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  getSingleProductReviews,
};
