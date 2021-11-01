const { createAllTables, dropTableIfExists } = require("./seed-functions.js");


const seed = (data) => {
    //drop tables if they already exist
    return dropTableIfExists('comments')
        .then(() => dropTableIfExists('reviews'))
        .then(() => dropTableIfExists('categories'))
        .then(() => dropTableIfExists('users'))

        //create tables
        .then(() => createAllTables())

        //insert data
        

        //catch errors
        .catch(err => console.log(err))
};

module.exports = seed;
