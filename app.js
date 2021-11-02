const express = require('express');
const { handle404Error, handleCustomErrors } = require('./controllers/errors.controllers.js');
const apiRouter = require('./routes/apiRouter.js');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', handle404Error);

app.use(handleCustomErrors)


module.exports = app;
