const { selectCategories } = require("../models/categories.models.js")

exports.getCategories = async (req,res) => {
    const categoriesArray = await selectCategories();
    res.status(200).send({categories: categoriesArray})
}