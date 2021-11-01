const format = require('pg-format');
const db = require('../connection.js');

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
        name TEXT,
        avatar_url TEXT
    );`
    return db
            .query(queryStrUsers)
            .then(() => {
                // create 'categories' table
                const queryStrCategories = `CREATE TABLE categories(
                    slug TEXT PRIMARY KEY UNIQUE,
                    description TEXT
                );`
                return db
                        .query(queryStrCategories)
                        .then(() => {
                            // create 'reviews' table
                            const queryStrReviews = `CREATE TABLE reviews(
                                review_id SERIAL PRIMARY KEY,
                                title TEXT,
                                designer TEXT,
                                owner TEXT REFERENCES users(username),
                                review_img_url TEXT,
                                review_body TEXT,
                                category TEXT REFERENCES categories(slug),
                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                review_votes INT DEFAULT 0
                            );`
                            return db
                                    .query(queryStrReviews)
                                    .then(() => {
                                    // create 'comments' table
                                    const queryStrComments = `CREATE TABLE comments(
                                        comment_id SERIAL PRIMARY KEY,
                                        body TEXT,
                                        comment_votes INT DEFAULT 0,
                                        author TEXT REFERENCES users(username),
                                        review_id INT REFERENCES reviews(review_id),
                                        created_at TIMESTAMP
                                    );`
                                    return db.query(queryStrComments)
                                })
                        })
            })
}





