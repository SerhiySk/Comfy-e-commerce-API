const {
  CustomAPIError,
  UnauthenticatedError,
  UnauthorizedError,
} = require('../errors');
const { createJWT, verifyJWT, attachUserToResponse } = require('../utils/jwt');
const authentificateUser = async (req, res, next) => {
  const token = req.signedCookies.token;

  if (!token) throw new CustomAPIError('Authentification invalid');
  try {
    console.log(verifyJWT({ token }));
    const {
      payload: { name, userId, role },
    } = verifyJWT({ token });

    req.user = {
      name,
      userId,
      role,
    };
    console.log(name, userId, role);
    next();
  } catch (error) {
    throw new UnauthenticatedError('Authentification invalid');
  }
};
const authPermition = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      throw new UnauthorizedError('Unauthorized to access this route');
    next();
  };
};
module.exports = { authentificateUser, authPermition };
