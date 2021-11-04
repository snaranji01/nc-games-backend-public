const { getApiDescription } = require('../controllers/api-description.controller.js');
const categoriesRouter = require('./categoriesRouter.js');
const reviewsRouter = require('./reviewsRouter.js');

const apiRouter = require('express').Router();

apiRouter.get('/', getApiDescription);

apiRouter.use('/categories', categoriesRouter);

apiRouter.use('/reviews', reviewsRouter);

module.exports = apiRouter;