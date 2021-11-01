const format = require('pg-format');
const { query } = require('../connection.js');
const db = require('../connection.js');
const { createRef } = require('./utils.js');

exports.dropTableIfExists = tableName => {
    if (!['users', 'categories', 'reviews', 'comments'].includes(tableName)) {
        throw new Error('Invalid table name passed as input into dropTableIfExists() function')
    }
    
    return db.query(`DROP TABLE IF EXISTS ${tableName};`);
}

exports.createAllTables = () => {
    // create 'users' table
    const queryStrUsers = `CREATE TABLE users(
        username TEXT UNIQUE PRIMARY KEY,
        name TEXT NOT NULL,
        avatar_url TEXT NOT NULL
    );`
    return db
            .query(queryStrUsers)
            .then(() => {
                // create 'categories' table
                const queryStrCategories = `CREATE TABLE categories(
                    slug TEXT PRIMARY KEY UNIQUE,
                    description TEXT NOT NULL
                );`
                return db
                        .query(queryStrCategories)
                        .then(() => {
                            // create 'reviews' table
                            const queryStrReviews = `CREATE TABLE reviews(
                                review_id SERIAL PRIMARY KEY,
                                title TEXT NOT NULL,
                                designer TEXT NOT NULL,
                                owner TEXT NOT NULL REFERENCES users(username),
                                review_img_url TEXT NOT NULL,
                                review_body TEXT NOT NULL,
                                category TEXT NOT NULL REFERENCES categories(slug),
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
                                review_votes INT DEFAULT 0 NOT NULL
                            );`
                            return db
                                    .query(queryStrReviews)
                                    .then(() => {
                                    // create 'comments' table
                                    const queryStrComments = `CREATE TABLE comments(
                                        comment_id SERIAL PRIMARY KEY,
                                        body TEXT NOT NULL,
                                        comment_votes INT DEFAULT 0 NOT NULL,
                                        author TEXT NOT NULL REFERENCES users(username),
                                        review_id INT NOT NULL REFERENCES reviews(review_id),
                                        created_at TIMESTAMP NOT NULL
                                    );`
                                    return db.query(queryStrComments)
                                })
                        })
            })
}

exports.insertAllData = data => {
    const { userData, categoryData, reviewData, commentData } = data;

    // insert 'users' data
    const queryStr = format(
        `INSERT INTO users (username, name, avatar_url) VALUES %L;`,
        userData.map(user => [user.username, user.name, user.avatar_url])
    );

    return db
        .query(queryStr)
        .then(() => {
            //insert 'categories' data
            const queryStr = format(
                `INSERT INTO categories (slug, description) VALUES %L;`,
                categoryData.map(category => [category.slug, category.description])
            );
            return db
                .query(queryStr)
                .then(() => {
                    //insert 'reviews' data
                    const queryStr = format(
                        `INSERT INTO reviews (title, designer, owner, review_img_url, review_body, category, created_at, review_votes) VALUES %L;`,
                        reviewData.map(review => [review.title, review.designer, review.owner, review.review_img_url, review.review_body, review.category, review.created_at, review.votes])
                    );
                    return db
                        .query(queryStr)
                        .then(() => {
                            //insert 'comments' data
                            const queryStr = format(
                                `INSERT INTO comments (body, comment_votes, author, review_id, created_at) VALUES %L;`,
                                commentData.map(comment => [comment.body, comment.votes, comment.author, comment.review_id, comment.created_at])
                            );
                            return db
                                .query(queryStr)
                        })
                })
        })


}





