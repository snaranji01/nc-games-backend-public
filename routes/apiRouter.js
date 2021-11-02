const { getCategories, getReviewById } = require('../controllers/categories.controllers.js');

const apiRouter = require('express').Router();

//apiRouter.get('/', getApiInfo);

apiRouter.get('/categories', getCategories);

apiRouter.get('/reviews/:review_id', getReviewById);

//apiRouter.get('/reviews', getReviews);

module.exports = apiRouter;