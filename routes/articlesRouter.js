const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validateUrl = require('../utils/utils');
const {
  getAllArticles, createArticle, deleteArticle, getAnArticle
} = require('../controllers/articlesController');

const articlesRouter = express.Router();

// Get All Articles
articlesRouter.get('/', getAllArticles);

// get an article
articlesRouter.get('/:_id', getAnArticle);

// Create an Article
articlesRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().min(2).max(30).required(),
    title: Joi.string().min(2).max(30).required(),
    text: Joi.string().min(2).max(300).required(),
    date: Joi.string().min(2).max(50).required(),
    source: Joi.string().min(2).max(50).required(),
    link: Joi.string().custom(validateUrl).required(),
    image: Joi.string().custom(validateUrl).required(),
    user: Joi.object()
  }),
}), createArticle);

// Delete an Article
articlesRouter.delete('/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().min(24).max(24).required()
      .hex(),
  }),
}), deleteArticle);

module.exports = articlesRouter;
