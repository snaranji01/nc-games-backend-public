const db = require("../db/connection.js");
const { checkPrimaryKeyValueExists } = require("./utils-models.js");

exports.selectUsers = async () => {
    const { rows: usersResponse } = await db.query(`SELECT * FROM users;`);
    return usersResponse;
}

exports.selectUserByUsername = async (username) => {
    //check username exists in users table
    await checkPrimaryKeyValueExists('username', 'users', username);
    // run query to select user
    const { rows: [user] } = await db.query(`SELECT * FROM users WHERE username=$1`, [username]);
    return user;
}