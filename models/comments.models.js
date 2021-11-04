const db = require("../db/connection.js");

exports.removeCommentByCommentId = async (comment_id) => {
    if (!(/^[\d]+$/.test(comment_id))) {
        return Promise.reject({
            status: 400,
            route: '/api/comments/:comment_id',
            msg: `400 Error: invalid comment_id, ${comment_id}, provided`
        })
    }

    const { rows: selectCommentIdsResponse } = await db.query(`SELECT comment_id FROM comments;`);
    const validCommentIds = selectCommentIdsResponse.map(responseEl => responseEl.comment_id.toString());

    if(!validCommentIds.includes(comment_id)) {
        return Promise.reject({
            status: 404,
            route: '/api/comments/:comment_id',
            msg: `404 Error: No comment with the provided comment_id, ${comment_id}, exists`
        })
    }

    await db.query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id]);
    return 
}