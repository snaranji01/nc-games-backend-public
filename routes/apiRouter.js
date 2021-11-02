

const apiRouter = require('express').Router();

//apiRouter.get('/', getApiInfo);

apiRouter.get('/categories', getCategories);

module.exports = apiRouter;