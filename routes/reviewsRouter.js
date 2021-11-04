const { getReviewById, patchReviewById, getReviews, getReviewCommentsById } = require('../controllers/reviews.controllers.js');

const reviewsRouter = require('express').Router();

reviewsRouter
    .route('/')
    .get(getReviews)

reviewsRouter
    .route('/:review_id')
    .get(getReviewById)
    .patch(patchReviewById)
    .route('/comments')

reviewsRouter
    .route('/:review_id/comments')
    .get(getReviewCommentsById)

module.exports = reviewsRouter;