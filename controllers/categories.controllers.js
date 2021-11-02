const { selectCategories, selectReviewById } = require("../models/categories.models.js")

exports.getCategories = async (req,res) => {
    const categoriesArray = await selectCategories();
    res.status(200).send({categories: categoriesArray});
}

exports.getReviewById = async (req,res) => {
    const {review_id} = req.params;
    const review = await selectReviewById(review_id);
    console.log(review)
    res.status(200).send({review});
}

/* exports.getReviews = async (req,res) => {
    const reviews = await selectReviews();
    
    res.status(200).send({reviews});
} */