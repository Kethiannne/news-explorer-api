const Article = require('../models/articlesModel');
const MyErr = require('../errors/errors');

// Cast Error Handler
function castErrorHandler(next, err) {
  if ((err.name === 'CastError') || (err.message === 'Cannot read property \'owner\' of null')) {
    next(new MyErr(404, 'Sorry. Thats not a Proper Article'));
  }
  next(err);
}

// Get all Articles
module.exports.getAllArticles = (req, res, next) => {
  Article.find({}).select('+owner')
    .then((articles) => {
      function checkId(article) {
        return article.owner._id.toString() === req.user._id;
      }
      const checkedArticles = articles.filter(checkId);
      res.status(200).send({ checkedArticles });
    })
    .catch(next);
};

// Create an Article
module.exports.createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  Article.create({
    keyword, title, text, date, source, link, image, owner: req.user._id,
  })
    .then((article) => {
      res.send({ article });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new MyErr(400, 'Sorry. Thats not a Proper Link'));
      }
      next(err);
    });
};

// Delete an Article
module.exports.deleteArticle = (req, res, next) => {
  const articleId = req.params._id;

  Article.findById(articleId).select('+owner')
    .then((article) => {
      if (req.user._id !== article.owner._id.toString()) {
        throw new MyErr(403, 'Authorization error');
      }
      return article;
    })
    .then(() => {
      Article.findByIdAndRemove(articleId)
        .then((article) => {
          if (!article) {
            throw new MyErr(404, 'Article not Found');
          }
          return res.send({ article });
        })
        .catch((err) => castErrorHandler(next, err));
    })
    .catch((err) => castErrorHandler(next, err));
};
