const { deleteCommentByCommentId } = require('../controllers/comments.controllers.js');

const commentsRouter = require('express').Router();

commentsRouter
    .route('/:comment_id')
    .delete(deleteCommentByCommentId)


module.exports = commentsRouter;