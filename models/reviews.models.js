const db = require("../db/connection.js")



exports.selectReviewById = async (review_id) => {
    const reviewObj = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id])
                            .then(({rows}) => {
                                const reviewObj = rows[0];
                                return db.query(`SELECT COUNT(*) FROM comments WHERE review_id = $1;`, [review_id])
                                    .then(({rows}) => {
                                        const comment_count = parseInt(rows[0].count);
                                        return {...reviewObj, comment_count }
                                    })
                            })
    return reviewObj
}

/* exports.selectReviews = async () => {
    const { rows } = await db.query(`SELECT * FROM reviews;`);
    return rows
} */