const db = require("../db/connection.js");
const {
  checkPrimaryKeyIsPositiveInteger,
  checkPrimaryKeyValueExists,
} = require("./model-utils.js");

const selectCommentCountByReviewId = async (review_id) => {
  const { rows: commentCountQueryResponse } = await db.query(
    `SELECT COUNT(*) FROM comments WHERE review_id = $1;`,
    [review_id]
  );
  const commentCount = parseInt(commentCountQueryResponse[0].count);
  return commentCount;
};

exports.selectReviewById = async (review_id) => {
  // check review_id is a number
  await checkPrimaryKeyIsPositiveInteger(review_id, "reviews");
  // check review_id exists
  await checkPrimaryKeyValueExists("review_id", "reviews", review_id);
  // get comment count by review_id
  const commentCount = await selectCommentCountByReviewId(review_id);
  // query for review at review_id
  const {
    rows: [reviewObj],
  } = await db.query("SELECT * FROM reviews WHERE review_id=$1;", [review_id]);
  // return response
  return { ...reviewObj, comment_count: commentCount };
};

exports.updateReviewById = async (review_id, inc_votes) => {
  // check review_id is a number
  await checkPrimaryKeyIsPositiveInteger(review_id, "reviews");
  // check review_id exists
  await checkPrimaryKeyValueExists("review_id", "reviews", review_id);
  //check if inc_votes exists in req body
  if (inc_votes === undefined) {
    return Promise.reject({
      status: 400,
      msg: `400 Error Bad Request: Missing 'inc_votes' in request body`,
    });
  }
  // query for current review_votes value
  const {
    rows: [responseReviewObj],
  } = await db.query(`SELECT review_votes FROM reviews WHERE review_id = $1;`, [
    review_id,
  ]);
  const currentReviewVotes = responseReviewObj.review_votes;
  // create variable for new review_votes value
  const newReviewUpvotes = currentReviewVotes + parseInt(inc_votes);
  // update to new review_votes value in db
  const {
    rows: [reviewObj],
  } = await db.query(
    `UPDATE reviews SET review_votes = $1 WHERE review_id = $2 RETURNING *;`,
    [newReviewUpvotes, review_id]
  );
  // select commentCount by review_id
  const commentCount = await selectCommentCountByReviewId(review_id);
  // return response
  return { ...reviewObj, comment_count: commentCount };
};

exports.selectReviews = async (sort_by, order, category) => {
  const columnNames = [
    "owner",
    "title",
    "review_id",
    "category",
    "review_img_url",
    "created_at",
    "review_votes",
    "comment_count",
  ];
  let selectReviewsQuery = `SELECT r.*, COUNT(c.review_id) AS "comment_count"
                                    FROM comments AS c
                                    RIGHT OUTER JOIN reviews AS r
                                    ON c.review_id = r.review_id`;

  // get existingCategories
  const { rows: existingCategoriesResponse } = await db.query(
    `SELECT slug FROM categories;`
  );
  const existingCategories = existingCategoriesResponse.map(
    (responseEl) => responseEl.slug
  );

  // filter by category if passed
  if (!category) {
    //pass
  } else if (existingCategories.includes(category)) {
    if (/'{1}/.test(category)) {
      let replacedApostropheCategory = category.replace(/'{1}/g, "''");
      selectReviewsQuery = `${selectReviewsQuery} WHERE r.category='${replacedApostropheCategory}'`;
    } else {
      selectReviewsQuery = `${selectReviewsQuery} WHERE r.category='${category}'`;
    }
  } else {
    return Promise.reject({
      status: 404,
      route: "/api/reviews",
      msg: `404 Error Not Found: category query parameter provided doesn't exist`,
    });
  }

  if (!sort_by || sort_by === "created_at") {
    selectReviewsQuery = `${selectReviewsQuery} GROUP BY r.review_id ORDER BY r.created_at`;
  } else if (columnNames.includes(sort_by)) {
    selectReviewsQuery = `${selectReviewsQuery} GROUP BY r.review_id ORDER BY ${sort_by}`;
  } else {
    return Promise.reject({
      status: 400,
      route: "/api/reviews",
      msg: `400 Error Bad Request: invalid sort_by query parameter provided`,
    });
  }

  if (!order || order === "desc") {
    selectReviewsQuery = `${selectReviewsQuery} DESC;`;
  } else if (order === "asc") {
    selectReviewsQuery = `${selectReviewsQuery} ASC;`;
  } else {
    return Promise.reject({
      status: 400,
      route: "/api/reviews",
      msg: `400 Error Bad Request: invalid order query parameter provided`,
    });
  }

  const { rows: reviewsArray } = await db.query(selectReviewsQuery);
  reviewsArray.forEach(
    (review) => (review.comment_count = parseInt(review.comment_count))
  );
  return reviewsArray;
};

exports.selectReviewCommentsById = async (review_id) => {
  // check review_id is a number
  await checkPrimaryKeyIsPositiveInteger(review_id, "reviews");
  // check review_id exists
  await checkPrimaryKeyValueExists("review_id", "reviews", review_id);
  //query to select review comments by review_id
  const { rows: reviewCommentsArray } = await db.query(
    `SELECT * FROM comments WHERE review_id=$1;`,
    [review_id]
  );
  // return review comments
  return reviewCommentsArray;
};

exports.addReviewCommentById = async (review_id, username, body) => {
  // check request body included 'username' and 'body' keys
  if (body === undefined || username === undefined) {
    return Promise.reject({
      status: 400,
      route: "/api/reviews",
      msg: `400 Error Bad Request: request body missing 'body' key or 'username' key`,
    });
  }
  // check review_id is a number - 400 Bad Request
  await checkPrimaryKeyIsPositiveInteger(review_id, "reviews");
  // check review_id exists - 404 review_id Not Found
  await checkPrimaryKeyValueExists("review_id", "reviews", review_id);
  // check username exists - 404 username Not Found
  await checkPrimaryKeyValueExists("username", "users", username);

  // query to insert new comment into comments table
  const insertQuery = `INSERT INTO comments(body, author, review_id, created_at) VALUES ($1, $2, $3, $4) RETURNING *;`;
  const insertQueryValues = [body, username, review_id, new Date(Date.now())];
  const {
    rows: [newCommentObj],
  } = await db.query(insertQuery, insertQueryValues);
  // return new comment
  return newCommentObj;
};
