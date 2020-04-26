const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { AuthenticationError } = require('apollo-server-express');

const schema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  hashedPassword: {
    type: String,
  },
  token: {
    type: String,
  },
  courses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
  ],
});

schema.statics.authenticate = async function authenticate({ email, password }) {
  const user = await this.findOne({ email });

  if (!user) {
    throw new AuthenticationError('Email or password are wrong');
  }

  const same = await bcrypt.compare(password, user.hashedPassword);

  if (!same) {
    throw new AuthenticationError('Email or password are wrong');
  }

  user.token = await jwt.sign({ id: user.id }, 'asdasd');

  return user;
};

schema.virtual('password');

schema.pre('validate', async function onSchemaPresave(next) {
  if (this.password == undefined) {
    return next();
  }

  try {
    const hash = await bcrypt.hash(this.password, 8);
    this.hashedPassword = hash;
    next();
  } catch (error) {
    next();
    throw error;
  }
});

module.exports = mongoose.model('User', schema);
