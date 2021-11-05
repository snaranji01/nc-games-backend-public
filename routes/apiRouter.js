const { getApiDescription } = require('../controllers/api-description.controller.js');
const categoriesRouter = require('./categoriesRouter.js');
const commentsRouter = require('./commentsRouter.js');
const reviewsRouter = require('./reviewsRouter.js');
const usersRouter = require('./usersRouter.js');

const apiRouter = require('express').Router();

apiRouter.get('/', getApiDescription);

apiRouter.use('/categories', categoriesRouter);

apiRouter.use('/reviews', reviewsRouter);

apiRouter.use('/comments', commentsRouter);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;