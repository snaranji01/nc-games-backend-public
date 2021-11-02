const { getReviewById } = require('../controllers/reviews.controllers.js');

const reviewsRouter = require('express').Router();

reviewsRouter
    .route('/:review_id')
    .get(getReviewById)

module.exports = reviewsRouter;