const { removeCommentByCommentId } = require("../models/comments.models.js");


exports.deleteCommentByCommentId = async (req, res, next) => {
    try {
        const { comment_id } = req.params;
        await removeCommentByCommentId(comment_id);
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }
}