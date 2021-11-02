const { selectCategories } = require("../models/categories.models.js")

exports.getCategories = async (req, res) => {
    try {
        const categoriesArray = await selectCategories();
        res.status(200).send({ categories: categoriesArray });
    } catch (error) {
        next(error)
    }

}

