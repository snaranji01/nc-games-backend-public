const db = require("../db/connection.js");
const { checkStringIsPositiveInteger, checkPrimaryKeyValueExists } = require("./utils-models.js");


exports.removeCommentByCommentId = async (comment_id) => {
    // 400 Error: check if comment_id is a number
    await checkStringIsPositiveInteger(comment_id, 'comments');
    // 404 Error: check comment_id exists in comments table
    await checkPrimaryKeyValueExists('comment_id', 'comments', comment_id);
    // carry out delete query
    await db.query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id]);
}

exports.updateCommentByCommentId = async (comment_id, inc_votes) => {
    // 400 Error: check if comment_id is a number
    await checkStringIsPositiveInteger(comment_id, 'comments');
    // 404 Error: check comment_id exists in comments table
    await checkPrimaryKeyValueExists('comment_id', 'comments', comment_id);

    //check if inc_votes exists in req body
    if (inc_votes === undefined) {
        return Promise.reject({
            status: 400,
            msg: `400 Error Bad Request: Missing 'inc_votes' in request body`
        })
    }

    // 400 Error: check if inc_votes value is a number (can also start with '-' character)
    if (/^[\d]+$/.test(inc_votes) || /^-[\d]+$/.test(inc_votes)) {
        // pass
    } else {
        return Promise.reject({
            status: 400,
            msg: `400 Error Bad Request: Invalid 'inc_votes' value in request body`
        })
    }


    // retrieve existing comment at this comment_id
    const { rows: [existingCommentObj] } = await db.query(`SELECT * FROM comments WHERE comment_id = $1;`, [comment_id]);
    const updatedCommentVotes = existingCommentObj.comment_votes + parseInt(inc_votes)
    // perform update query
    const { rows: [updatedCommentObj] } = await db.query(`UPDATE comments SET comment_votes = $1 WHERE comment_id = $2 RETURNING *;`, [updatedCommentVotes, comment_id]);
    // return value
    return updatedCommentObj;
}