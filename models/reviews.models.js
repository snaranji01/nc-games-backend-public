const db = require("../db/connection.js")



exports.selectReviewById = async (review_id) => {
    const { rows: [reviewObj] } = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id]);
    const { rows: [queryResponse] } = await db.query(`SELECT COUNT(*) FROM comments WHERE review_id = $1;`, [review_id]);

    return { ...reviewObj, comment_count: parseInt(queryResponse.count) }
}

/* exports.selectReviews = async () => {
    const { rows } = await db.query(`SELECT * FROM reviews;`);
    return rows
} */