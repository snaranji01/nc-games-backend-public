const db = require("../db/connection.js");

exports.selectUsers = async () => {
    const { rows: usersResponse } = await db.query(`SELECT * FROM users;`);
    return usersResponse;
}