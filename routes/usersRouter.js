const express = require('express');
const { celebrate, Joi } = require('celebrate');
const {
  getCurrentUser,
} = require('../controllers/usersController');

const usersRouter = express.Router();

// Get The Current User
usersRouter.get('/me', celebrate({
  body: Joi.object().keys({
    user: Joi.object().keys({
      _id: Joi.string().min(24).max(24).required()
        .hex(),
    }),
  }),
}), getCurrentUser);


module.exports = usersRouter;
