const db = require("../db/connection.js");

//utils
const checkCommentIdExists = async comment_id => {
    const { rows: selectCommentIdsResponse } = await db.query(`SELECT comment_id FROM comments;`);
    const existingCommentIds = selectCommentIdsResponse.map(responseEl => responseEl.comment_id.toString());

    if (existingCommentIds.includes(comment_id)) {
        // pass
    } else {
        return Promise.reject({
            status: 404,
            msg: `404 Error Not Found: No comment with the provided comment_id was found`
        })
    }
}

const checkCommentIdIsNumber = async (comment_id) => {
    if ( /^[\d]+$/.test(comment_id) ) {
        //pass
    } else {
        return Promise.reject({
            status: 400,
            msg: `400 Error Bad Request: invalid comment_id`
        })
    }
}
///////////////////

exports.removeCommentByCommentId = async (comment_id) => {
    if (!(/^[\d]+$/.test(comment_id))) {
        return Promise.reject({
            status: 400,
            msg: `400 Error: invalid comment_id, ${comment_id}, provided`
        })
    }

    const { rows: selectCommentIdsResponse } = await db.query(`SELECT comment_id FROM comments;`);
    const validCommentIds = selectCommentIdsResponse.map(responseEl => responseEl.comment_id.toString());

    if (!validCommentIds.includes(comment_id)) {
        return Promise.reject({
            status: 404,
            msg: `404 Error: No comment with the provided comment_id, ${comment_id}, exists`
        })
    }

    await db.query(`DELETE FROM comments WHERE comment_id=$1`, [comment_id]);
    return
}

exports.updateCommentByCommentId = async (comment_id, inc_votes) => {
    // 400 Error : check if comment_id is a number
    if ( /^[\d]+$/.test(comment_id) ) {
        //pass
    } else {
        return Promise.reject({
            status: 400,
            msg: `400 Error Bad Request: invalid comment_id`
        })
    }
    // 404 Error: check comment_id exists in comments table
    const { rows: selectCommentIdsResponse } = await db.query(`SELECT comment_id FROM comments;`);
    const existingCommentIds = selectCommentIdsResponse.map(responseEl => responseEl.comment_id.toString());

    if (existingCommentIds.includes(comment_id)) {
        // pass
    } else {
        return Promise.reject({
            status: 404,
            msg: `404 Error Not Found: No comment with the provided comment_id was found`
        })
    }

    //check if inc_votes exists in req body
    if(inc_votes === undefined) {
        return Promise.reject({
            status: 400,
            msg: `400 Error Bad Request: Missing 'inc_votes' in request body`
        })
    }
    
    // 400 Error: check if inc_votes value is a number (can also start with '-' character)
    if ( /^[\d]+$/.test(inc_votes) || /^-[\d]+$/.test(inc_votes) ) {
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