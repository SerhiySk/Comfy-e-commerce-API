const bcrypt = require('bcryptjs');
const validator = require('validator');
const mongoose = require('mongoose');
require('dotenv');
const UserSchema = mongoose.Schema({
  name: { type: String, required: [true, 'Please provide name'] },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
    unique: true,
  },
  password: { type: String, required: [true, 'Please provide password'] },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
});

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  console.log(this.password);
});

UserSchema.methods.comparePasswords = async function (passedPassword) {
  const comparisonResult = await bcrypt.compare(passedPassword, this.password);
  return comparisonResult;
};

module.exports = mongoose.model('User', UserSchema);
