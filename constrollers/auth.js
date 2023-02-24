const { StatusCodes } = require('http-status-codes');
const { NotFoundError, BadRequestError } = require('../errors');
const User = require('../models/user');
const {
  createJWT,
  verifyJWT,
  attachUserToResponse,
  createTokenUser,
} = require('../utils');

const register = async (req, res) => {
  const firstAcc = (await User.countDocuments({})) === 0;
  const role = firstAcc ? 'admin' : 'user';
  const { name, email, password } = req.body;
  const user = await User.create({ name, email, password, role });
  const tokenUser = createTokenUser(user);
  await attachUserToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};
const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(req.body);
  if (!email || !password)
    throw new BadRequestError('Email and password must be provided');

  const user = await User.findOne({ email });

  if (!user) throw new NotFoundError('User not found');
  const comparePasswords = await user.comparePasswords(password);

  if (!comparePasswords) throw new NotFoundError('Passwords do not match');

  const tokenUser = createTokenUser(user);
  console.log(tokenUser);
  await attachUserToResponse({ res, user: tokenUser });

  res.status(StatusCodes.CREATED).json({ user: tokenUser });
};
const logout = async (req, res) => {
  // req.signedCookies.token = '';
  res.cookie('token', 'Loggout', {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.send('Logged out');
};
module.exports = { register, login, logout };
