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

    if (responseCountObj === undefined) {
        return Promise.reject({
            status: 404,
            route: '/api/review/:review_id',
            msg: `404 Error, no review found with a review_id of ${review_id}`
        })
    }

    const newReviewUpvotes = responseCountObj.review_votes + parseInt(inc_votes);

    const { rows: reviewObjQueryResponse } = await db.query(`UPDATE reviews SET review_votes = $1 WHERE review_id = $2 RETURNING *;`, [newReviewUpvotes, review_id]);
    const { rows: commentCountQueryResponse } = await db.query(`SELECT COUNT(*) FROM comments WHERE review_id = $1;`, [review_id]);

    const reviewObj = reviewObjQueryResponse[0];
    const commentCount = parseInt(commentCountQueryResponse[0].count)

    return { ...reviewObj, comment_count: commentCount }
}

exports.selectReviews = async (sort_by, order, category) => {
    const columnNames = ["owner", "title", "review_id", "category", "review_img_url", "created_at", "review_votes", "comment_count"];
    let selectReviewsQuery =       `SELECT r.*, COUNT(c.review_id) AS "comment_count"
                                    FROM comments AS c
                                    RIGHT OUTER JOIN reviews AS r
                                    ON c.review_id = r.review_id`
    

    const {rows: validCategoriesResponse} = await db.query(`SELECT slug FROM categories;`);
    const validCategories = validCategoriesResponse.map(responseEl => responseEl.slug);

    if (validCategories.includes(category)) {
        if(/'{1}/.test(category)) {
            replacedApostropheCategory = category.replace(/'{1}/g, "''");
            selectReviewsQuery = `${selectReviewsQuery} WHERE r.category='${replacedApostropheCategory}'`;
        } else {
            selectReviewsQuery = `${selectReviewsQuery} WHERE r.category='${category}'`;
        }
        
    } 



    if (!sort_by || sort_by === 'created_at') {
        selectReviewsQuery = `${selectReviewsQuery} GROUP BY r.review_id ORDER BY r.created_at`
    } else if (columnNames.includes(sort_by)) {
        selectReviewsQuery = `${selectReviewsQuery} GROUP BY r.review_id ORDER BY ${sort_by}`
    } else {
        return Promise.reject({
            status: 400,
            route: '/api/review',
            msg: `400 Error: invalid sort_by query parameter, ${sort_by}, was provided`
        })
    }

    if (!order || order === 'desc') {
        selectReviewsQuery = `${selectReviewsQuery} DESC;`
    } else if (order === 'asc') {
        selectReviewsQuery = `${selectReviewsQuery} ASC;`
    } else {
        return Promise.reject({
            status: 400,
            route: '/api/review',
            msg: `400 Error: invalid order query parameter, ${order}, was provided`
        })
    }
    const { rows: reviewsArray } = await db.query(selectReviewsQuery);
    reviewsArray.forEach(review => review.comment_count = parseInt(review.comment_count))
    return reviewsArray;
}