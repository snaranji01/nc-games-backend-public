const { selectReviewById } = require("../models/reviews.models.js");


exports.getReviewById = async (req, res, next) => {
    try {
        const { review_id } = req.params;
        const review = await selectReviewById(review_id)
        res.status(200).send({ review });
    } catch (error) {
        next(error)
    }

}

/* exports.getReviews = async (req,res) => {
    const reviews = await selectReviews();
    
    res.status(200).send({reviews});
} */
