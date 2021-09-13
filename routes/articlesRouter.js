const express = require('express');
const { celebrate, Joi } = require('celebrate');
const validateUrl = require('../utils/utils');
const {
  getAllArticles, createArticle, deleteArticle,
} = require('../controllers/articlesController');

const articlesRouter = express.Router();

// Get All Articles
articlesRouter.get('/', getAllArticles);

// Create an Article
articlesRouter.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().min(2).max(30).required(),
    title: Joi.string().min(2).max(30).required(),
    description: Joi.string().min(2).max(300).required(),
    publishedAt: Joi.string().min(2).max(50).required(),
    src: Joi.string().min(2).max(50).required(),
    url: Joi.string().custom(validateUrl).required(),
    urlToImage: Joi.string().custom(validateUrl).required(),
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
