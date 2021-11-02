const categoriesRouter = require('./categoriesRouter.js');
const reviewsRouter = require('./reviewsRouter.js');

const apiRouter = require('express').Router();

//apiRouter.get('/', getApiInfo);

apiRouter.use('/categories', categoriesRouter);

apiRouter.use('/reviews', reviewsRouter);


//apiRouter.get('/reviews', getReviews);

module.exports = apiRouter;