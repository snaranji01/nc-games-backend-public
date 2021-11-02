const express = require('express');
const { handle404Error, handleCustomErrors, handle500ServerError, handlePSQLErrors } = require('./controllers/errors.controllers.js');
const apiRouter = require('./routes/apiRouter.js');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', handle404Error);

app.use(handleCustomErrors)
app.use(handlePSQLErrors)
app.use(handle500ServerError)

module.exports = app;
