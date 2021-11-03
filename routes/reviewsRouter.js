const { getReviewById, patchReviewById, getReviews } = require('../controllers/reviews.controllers.js');

const reviewsRouter = require('express').Router();

reviewsRouter
    .route('/')
    .get(getReviews)

reviewsRouter
    .route('/:review_id')
    .get(getReviewById)
    .patch(patchReviewById)

module.exports = reviewsRouter;