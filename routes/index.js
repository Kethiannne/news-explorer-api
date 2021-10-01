const express = require('express');
const { celebrate, Joi } = require('celebrate');
const { createUser, loginUser } = require('../controllers/usersController');
const articlesRouter = require('./articlesRouter');
const usersRouter = require('./usersRouter');

const mainRouter = express.Router();

const authMid = require('../middleware/authMiddleware');

const MyErr = require('../errors/errors');

// Signup and Signin Routes
mainRouter.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser);

mainRouter.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  loginUser);

// Main Routers
mainRouter.use('/articles', authMid, articlesRouter);
mainRouter.use('/users', authMid, usersRouter);

/// All Other Routes get a 404
mainRouter.get('*', (_, __, next) => {
  next(new MyErr(404, 'Requested resource not found'));
});

module.exports = mainRouter;
