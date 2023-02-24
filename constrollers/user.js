const { StatusCodes } = require('http-status-codes');
const User = require('../models/user');
const { NotFoundError, BadRequestError } = require('../errors');

const {
  createJWT,
  verifyJWT,
  attachUserToResponse,
  checkPermisions,
  createTokenUser,
} = require('../utils');

const getAllUsers = async (req, res) => {
  const users = await User.find({ role: 'user' }).select('-password');

  res.status(StatusCodes.OK).json({ users });
};
const getSingleUser = async (req, res) => {
  const user = await User.findOne({ _id: req.params.id });
  if (!user) throw new NotFoundError(`No user with id: ${req.params.id}`);
  checkPermisions(req.user, req.params.id);
  res.status(StatusCodes.OK).json({ user });
};
const showCurrentUser = (req, res) => {
  res.status(StatusCodes.OK).json({ user: req.user });
};
const updateUser = async (req, res) => {
  const { email, name } = req.body;
  console.log(req.body);
  if (!email || !name) throw new BadRequestError('Please provide all values');
  const user = await User.findOne({ _id: req.user.userId });
  user.email = email;
  user.name = name;

  await user.save();

  const tokenUser = createTokenUser(user);
  await attachUserToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ user: tokenUser });
};
const updateUserPassword = async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword)
    throw new BadRequestError('Please provide all values');
  const user = await User.findOne({ _id: req.user.userId });

  const comparePasswords = await user.comparePasswords(oldPassword);

  if (!comparePasswords) throw new NotFoundError('Passwords do not match');
  user.password = newPassword;
  await user.save();
  const tokenUser = createTokenUser(user);

  await attachUserToResponse({ res, user: tokenUser });
  res.status(StatusCodes.OK).json({ msg: 'Success! Password Updated.' });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  updateUserPassword,
};

// updateUser with findAndUpdate

// const updateUser = async (req, res) => {
//   const { email, name } = req.body;
//   console.log(req.body);
//   if (!email || !name) throw new BadRequestError('Please provide all values');
//   const user = await User.findOneAndUpdate(
//     { _id: req.user.userId },
//     { email, name },
//     { new: true, runValidators: true }
//   );

//   const tokenUser = createTokenUser(user);
//   await attachUserToResponse({ res, user: tokenUser });
//   res.status(StatusCodes.OK).json({ user: tokenUser });
// };
