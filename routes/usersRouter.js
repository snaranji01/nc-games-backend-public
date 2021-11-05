const { getUsers } = require('../controllers/users.controllers.js');

const usersRouter = require('express').Router();

usersRouter
    .route('/')
    .get(getUsers)

module.exports = usersRouter;