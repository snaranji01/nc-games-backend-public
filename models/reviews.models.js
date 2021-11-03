const db = require("../db/connection.js");
const reviews = require("../db/data/test-data/reviews.js");
const { createRefObject } = require("../db/utils.js");


exports.selectReviewById = async (review_id) => {
    if (!(/^[\d]+$/.test(review_id))) {

        return Promise.reject({
            status: 400,
            route: '/api/review/:review_id',
            msg: `400 Error: invalid input_id, ${review_id}, provided`
        })
    }

    const { rows: reviewObjQueryResponse } = await db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [review_id]);
    const { rows: commentCountQueryResponse } = await db.query(`SELECT COUNT(*) FROM comments WHERE review_id = $1;`, [review_id]);

    if (reviewObjQueryResponse.length === 0) {
        return Promise.reject({
            status: 404,
            route: '/api/review/:review_id',
            msg: `404 Error, no review found with a review_id of ${review_id}`
        })
    }

    const reviewObj = reviewObjQueryResponse[0];
    const commentCount = parseInt(commentCountQueryResponse[0].count)

    return { ...reviewObj, comment_count: commentCount }
}

exports.updateReviewById = async (review_id, inc_votes) => {
    if (!(/^[\d]+$/.test(review_id))) {

        return Promise.reject({
            status: 400,
            route: '/api/review/:review_id',
            msg: `400 Error: invalid input_id, ${review_id}, provided`
        })
    }

    const { rows: [responseCountObj] } = await db.query(`SELECT review_votes FROM reviews WHERE review_id = $1;`, [review_id]);
    const newReviewUpvotes = responseCountObj.review_votes + parseInt(inc_votes);

    const { rows: reviewObjQueryResponse } = await db.query(`UPDATE reviews SET review_votes = $1 WHERE review_id = $2 RETURNING *;`, [newReviewUpvotes, review_id]);
    const { rows: commentCountQueryResponse } = await db.query(`SELECT COUNT(*) FROM comments WHERE review_id = $1;`, [review_id]);

    if (reviewObjQueryResponse.length === 0) {
        return Promise.reject({
            status: 404,
            route: '/api/review/:review_id',
            msg: `404 Error, no review found with a review_id of ${review_id}`
        })
    }

    const reviewObj = reviewObjQueryResponse[0];
    const commentCount = parseInt(commentCountQueryResponse[0].count)

    return { ...reviewObj, comment_count: commentCount }
}

exports.selectReviews = async (sort_by, order, category) => {
    let selectReviewsQuery;
    if (!sort_by) {
        selectReviewsQuery = `SELECT * FROM reviews ORDER BY created_at`
    }

    if (!order) {
        selectReviewsQuery = `${selectReviewsQuery} DESC;`
    }

    const { rows: reviewsArray } = await db.query(selectReviewsQuery);

    const commentCountsQuery = `SELECT review_id, COUNT(*) AS "commentCounts" FROM comments GROUP BY review_id;`
    const { rows: commentCountsResponse } = await db.query(commentCountsQuery);

    const referenceArray = createRefObject(commentCountsResponse, 'review_id','commentCounts');

    const reviewsArrayWithCounts = reviewsArray.map(review => {
        const comment_count = parseInt( referenceArray[ review.review_id.toString() ] || 0 )
        const reviewEntry = {
            ...review,
            comment_count
        }
        return reviewEntry
    })

    return reviewsArrayWithCounts
}