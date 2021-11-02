const db = require("../db/connection.js")



exports.selectReviewById = async (review_id) => {
    if ( !(/^[\d]+$/.test(review_id)) ) {
        
        return Promise.reject({
            status: 400,
            route: '/api/review/:review_id',
            msg: `400 Error: invalid input_id, ${review_id}, provided`
        })
    }

    const { rows: query1Response } = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id]);
    const { rows: query2Response } = await db.query(`SELECT COUNT(*) FROM comments WHERE review_id = $1;`, [review_id]);

    if(query1Response.length === 0) {
        return Promise.reject({
            status: 404,
            route: '/api/review/:review_id',
            msg: `404 Error, no review found with a review_id of ${review_id}`
        })
    }

    const reviewObj = query1Response[0];
    const commentCount = parseInt( query2Response[0].count )

    return { ...reviewObj, comment_count: commentCount }
}

exports.updateReviewById = async (review_id, inc_votes) => {
    if ( !(/^[\d]+$/.test(review_id)) ) {
        
        return Promise.reject({
            status: 400,
            route: '/api/review/:review_id',
            msg: `400 Error: invalid input_id, ${review_id}, provided`
        })
    }

    const { rows: [responseCountObj] } = await db.query(`SELECT review_votes FROM reviews WHERE review_id = $1;`, [review_id]);
    const newReviewUpvotes = responseCountObj.review_votes + parseInt(inc_votes);

    const { rows: query1Response } = await db.query(`UPDATE reviews SET review_votes = $1 WHERE review_id = $2 RETURNING *;`, [newReviewUpvotes, review_id]);
    const { rows: query2Response } = await db.query(`SELECT COUNT(*) FROM comments WHERE review_id = $1;`, [review_id]);

    if(query1Response.length === 0) {
        return Promise.reject({
            status: 404,
            route: '/api/review/:review_id',
            msg: `404 Error, no review found with a review_id of ${review_id}`
        })
    }

    const reviewObj = query1Response[0];
    const commentCount = parseInt( query2Response[0].count )

    return { ...reviewObj, comment_count: commentCount }
}

/* exports.selectReviews = async () => {
    const { rows } = await db.query(`SELECT * FROM reviews;`);
    return rows
} */