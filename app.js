// Dependency Imports
const express = require('express');
const helmet = require('helmet');
const Mongoose = require('mongoose');
const cors = require('cors');
const { celebrate, Joi, errors } = require('celebrate');
const rateLimit = require('express-rate-limit');

// Imports from My Files
//// Middleware Imports
const authMid = require('./middleware/authMiddleware');
const errsCentral = require('./middleware/errsCentral');
const { reqLogger, errLogger } = require('./middleware/logger');

//// Non-Middleware Imports
require('dotenv').config();
const MyErr = require('./errors/errors');
const articlesRouter = require('./routes/articlesRouter');
const usersRouter = require('./routes/usersRouter');
const { createUser, loginUser } = require('./controllers/usersController');

// Variables
const { PORT = 3000 } = process.env;

// A section setting up the server and connecting to the database
const app = express();
app.use(helmet());

//// Rate limiter, Prevents DDOS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
});

//// URLs that can access this server
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];
app.use(cors({ origin: allowedOrigins }));

//// Connection to MongoDB database
Mongoose.connect('mongodb://localhost:27017/around-backend', {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Middleware and Routes
//// Rate Limiter
app.use(limiter);

//// Request Logger
app.use(reqLogger);

//// Signin and Signup Routes
app.post('/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  loginUser
);

app.post('/signup',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
      name: Joi.string().min(2).max(30),
    }),
  }),
  createUser
);

//// Main Routers
app.use('/articles', articlesRouter);
app.use('/users', authMid, usersRouter);

//// All Other Routes get a 404
app.get('*', (_, __, next) => {
  next(new MyErr(404, 'Requested resource not found'));
});

// Error Handling

//// Error Logging
app.use(errLogger);

//// Celebrate Error Handler
app.use(errors());

//// Central Error Handler
app.use(errsCentral);

// if everything works fine, the console will show which port the application is listening to
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
