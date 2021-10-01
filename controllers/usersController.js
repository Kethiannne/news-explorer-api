const bcrypt = require('bcryptjs');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/usersModel');
const MyErr = require('../errors/errors');

// Return Current User Info
module.exports.getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        throw new MyErr(404, 'User not Found');
      }
      return res.send(user);
    })
    .catch((err) => {
      if ((err.name === 'CastError')) {
        next(new MyErr(404, 'Sorry. Thats not a Proper Card'));
      }
      next(err);
    });
};

// Create a User
module.exports.createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        email, password: hash, name,
      })
        .then(() => res.send({ message: 'Successful registration' }))
        .catch((err) => {
          if (err.name === 'MongoError' && err.code === 11000) {
            next(new MyErr(409, 'User Already Exists'));
          }
          next(err);
        });
    });
};

// Login a User
module.exports.loginUser = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const userToken = jwt.sign({ _id: user._id },
        process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'dev-secret',
        { expiresIn: '7d' });
      res
        .status(201)
        .send({ userToken });
    })
    .catch(next);
};
