const { selectUsers } = require("../models/users.models.js")

exports.getUsers = async (req, res, next) => {
    try {
        const users = await selectUsers();
        res.status(200).send({ users });
    } catch (error) {
        next(error)
    }
}