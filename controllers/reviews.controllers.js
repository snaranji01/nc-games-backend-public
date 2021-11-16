const {
  selectReviewById,
  updateReviewById,
  selectReviews,
  selectReviewCommentsById,
  addReviewCommentById,
} = require("../models/reviews.models.js");

exports.getReviewById = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const review = await selectReviewById(review_id);
    res.status(200).send({ review });
  } catch (error) {
    next(error);
  }
};

exports.patchReviewById = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { inc_votes } = req.body;
    const review = await updateReviewById(review_id, inc_votes);
    res.status(200).send({ review });
  } catch (error) {
    next(error);
  }
};

exports.getReviews = async (req, res, next) => {
  try {
    const { sort_by, order, category } = req.query;
    const reviews = await selectReviews(sort_by, order, category);
    res.status(200).send({ reviews });
  } catch (error) {
    next(error);
  }
};

exports.getReviewCommentsById = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const reviewComments = await selectReviewCommentsById(review_id);
    res.status(200).send({ reviewComments });
  } catch (error) {
    next(error);
  }
};

exports.postReviewCommentByReviewId = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { username, body } = req.body;

    const newReviewComment = await addReviewCommentById(
      review_id,
      username,
      body
    );
    res.status(201).send({ newReviewComment });
  } catch (error) {
    next(error);
  }
};
