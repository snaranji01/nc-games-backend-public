const { removeCommentByCommentId, updateCommentByCommentId } = require("../models/comments.models.js");


exports.deleteCommentByCommentId = async (req, res, next) => {
    try {
        const { comment_id } = req.params;
        await removeCommentByCommentId(comment_id);
        res.sendStatus(204);
    } catch (error) {
        next(error)
    }
}

exports.patchCommentByCommentId = async (req, res, next) => {
    try {
        const { comment_id } = req.params;
        const { inc_votes } = req.body;

        const updatedComment = await updateCommentByCommentId(comment_id, inc_votes);
        return res.status(200).send({ updatedComment })

    } catch (error) {
        next(error)
    }
}