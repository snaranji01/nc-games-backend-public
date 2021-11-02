const db = require("../db/connection.js")



exports.selectReviewById = async (review_id) => {
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

/* exports.selectReviews = async () => {
    const { rows } = await db.query(`SELECT * FROM reviews;`);
    return rows
} */