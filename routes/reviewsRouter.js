const { getReviewById, patchReviewById, getReviews, getReviewCommentsById, postReviewCommentByReviewId } = require('../controllers/reviews.controllers.js');

const reviewsRouter = require('express').Router();

reviewsRouter
    .route('/')
    .get(getReviews)

reviewsRouter
    .route('/:review_id')
    .get(getReviewById)
    .patch(patchReviewById)

reviewsRouter
    .route('/:review_id/comments')
    .get(getReviewCommentsById)
    .post(postReviewCommentByReviewId)

module.exports = reviewsRouter;