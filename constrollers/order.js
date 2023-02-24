const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');

const Product = require('../models/product');
const Order = require('../models/order');
const { StatusCodes } = require('http-status-codes');

const checkPermissions = require('../utils/checkPermissions');

const fakeStripeAPI = async ({ amount, currency }) => {
  const client_secret = 'Random';
  return { client_secret, amount };
};

const createOrder = async (req, res) => {
  const { items: cartItems, tax, shippingFee } = req.body;
  console.log(req.body);
  if (!cartItems) throw new BadRequestError(`No cart items provided`);
  if (!tax || !shippingFee)
    throw new BadRequestError(`Please provide tax and shipping fee`);

  let orderItems = [];
  let subtotal = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item.product });
    if (!dbProduct)
      throw new NotFoundError(`No product found with id: ${item.product}`);
    const { name, price, image, _id } = dbProduct;
    const singleOrderItem = { name, price, image, amount: item.amount, _id };
    orderItems = [...orderItems, singleOrderItem];
    subtotal += item.amount * price;
  }
  const total = shippingFee + tax + subtotal;
  const paymentIntend = await fakeStripeAPI({ amount: total, currency: 'usd' });
  const order = await Order.create({
    tax,
    shippingFee,
    subtotal,
    total,
    orderItems,
    user: req.user.userId,
    clientSecret: paymentIntend.client_secret,
  });

  res
    .status(StatusCodes.CREATED)
    .json({ order, clientSecret: order.clientSecret });
};
const getAllOrders = async (req, res) => {
  const orders = await Order.find();
  res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrder = async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id });
  if (!order)
    throw new NotFoundError(`No order found with id:${req.params.id}`);
  console.log(req.user, req.params.id);
  checkPermissions(req.user, order.user);
  res.status(StatusCodes.OK).json({ order });
};
const updateOrder = async (req, res) => {
  const { paymentIntendId } = req.body;
  const order = await Order.findOne({ _id: req.params.id });
  if (!order)
    throw new NotFoundError(`No order found with id:${req.params.id}`);
  checkPermissions(req.user, order.user);
  order.paymentIntendId = paymentIntendId;
  order.status = 'paid';
  await order.save();
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrders = async (req, res) => {
  const orders = await Order.find({ user: req.user.userId });
  res.status(StatusCodes.OK).json({ orders });
};

module.exports = {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
