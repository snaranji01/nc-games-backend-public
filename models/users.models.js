const db = require("../db/connection.js");

exports.selectUsers = async () => {
    const { rows: usersResponse } = await db.query(`SELECT * FROM users;`);
    return usersResponse;
}

exports.selectUserByUsername = async (username) => {
    const { rows: usersResponse } = await db.query(`SELECT * FROM users;`);
    const existingUsernames = usersResponse.map(user => user.username);

    if(!existingUsernames.includes(username)) {
        return Promise.reject({
            status: 404,
            route: '/api/users/:user_id',
            msg: `404 Error: no user found with the provided username, ${username}`
        })
    }

    const { rows: [user] } = await db.query(`SELECT * FROM users WHERE username=$1`, [username]);
    console.log(user)
    return user;
}