const { getReviewById, patchReviewById } = require('../controllers/reviews.controllers.js');

const reviewsRouter = require('express').Router();

reviewsRouter
    .route('/:review_id')
    .get(getReviewById)
    .patch(patchReviewById)

module.exports = reviewsRouter;