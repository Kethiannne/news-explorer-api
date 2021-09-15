// Dependency Imports
const express = require('express');
const helmet = require('helmet');
const Mongoose = require('mongoose');
const { errors } = require('celebrate');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

// Imports from My Files
/// Middleware Imports
const errsCentral = require('./middleware/errsCentral');
const { reqLogger, errLogger } = require('./middleware/logger');

/// Non-Middleware Imports
require('dotenv').config();
const mainRouter = require('./routes/index');

// Variables
const { PORT = 3000, DB = 'mongodb://localhost:27017/around-backend' } = process.env;

// A section setting up the server and connecting to the database
const app = express();
app.use(helmet());

/// Rate limiter, Prevents DDOS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
});

/// URLs that can access this server
const allowedOrigins = [
  'https://www.kethnews.students.nomoreparties.site',
  'https://kethnews.students.nomoreparties.site',
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
];
app.use(cors({ origin: allowedOrigins }));

/// Connection to MongoDB database
Mongoose.connect((process.env.NODE_ENV === 'production' ? process.env.PROD_DB : DB), {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Middleware and Router
/// Body Parser
app.use(express.json());

/// Rate Limiter
app.use(limiter);

/// Request Logger
app.use(reqLogger);

/// Main Router
app.use('/', mainRouter);

// Error Handling
/// Celebrate Error Handler
mainRouter.use(errors());

/// Error Logging
app.use(errLogger);

/// Central Error Handler
app.use(errsCentral);

// if everything works fine, the console will show which port the application is listening to
app.listen(PORT, () => {
  console.log(`App listening at port ${PORT}`);
});
