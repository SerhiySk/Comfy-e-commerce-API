const jwt = require('jsonwebtoken');

const createJWT = userObj => {
  const payload = userObj.payload;
  return jwt.sign({ payload }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  });
};
const verifyJWT = ({ token }) => jwt.verify(token, process.env.JWT_SECRET);

const attachUserToResponse = async function ({ res, user }) {
  const oneDay = 1000 * 60 * 60 * 24;
  const token = createJWT({ payload: user });

  return res.cookie('token', token, {
    expires: new Date(Date.now() + oneDay),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    signed: true,
  });
};

module.exports = { createJWT, verifyJWT, attachUserToResponse };
