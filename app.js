const express = require('express');
const { handle404Error } = require('./controllers/errors.controllers.js');
const apiRouter = require('./routes/apiRouter.js');
const app = express();

app.use(express.json());

app.use('/api', apiRouter);

app.all('*', handle404Error);


module.exports = app;
