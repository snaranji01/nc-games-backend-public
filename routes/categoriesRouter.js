const { getCategories } = require('../controllers/categories.controllers.js');

const categoriesRouter = require('express').Router();

categoriesRouter
    .route('/')
    .get(getCategories)

module.exports = categoriesRouter;