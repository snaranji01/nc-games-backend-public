const db = require("../db/connection.js");
///////////////////////////////////////////////////////////////
getAllTableNames = async () => {
  const { rows: queryResponse } = await db.query(
    `SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname='public';`
  );
  const tableNames = queryResponse.map((responseEl) =>
    responseEl.tablename.toString()
  );
  return tableNames;
};

getAllColumnNames = async (tableName) => {
  const { rows: queryResponse } = await db.query(
    `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = '${tableName}';`
  );
  const columnNames = queryResponse.map((responseEl) =>
    responseEl.column_name.toString()
  );
  return columnNames;
};
//////////////////////////////////////////////////////////////

exports.checkPrimaryKeyValueExists = async (
  primaryKeyColumnName,
  tableName,
  valueToCheck
) => {
  // check passed in tableName exists in db
  const allTableNames = await getAllTableNames();
  if (allTableNames.includes(tableName)) {
    // pass
  } else {
    return Promise.reject({
      status: 500,
      msg: `passed tableName doesn't exist`,
    });
  }

  // check passed in column name exists within passed in tableName
  const allColumnNames = await getAllColumnNames(tableName);
  if (allColumnNames.includes(primaryKeyColumnName)) {
    // pass
  } else {
    return Promise.reject({
      status: 500,
      msg: `passed primaryKeyColumnName doesn't exist`,
    });
  }

  // select all primary key values of table
  const { rows: selectIdsResponse } = await db.query(
    `SELECT ${primaryKeyColumnName} FROM ${tableName};`
  );
  const existingIds = selectIdsResponse.map((responseEl) =>
    responseEl[primaryKeyColumnName].toString()
  );

  // check if id passed in exists in table where it's the primary key
  if (existingIds.includes(valueToCheck)) {
    // pass
  } else {
    errorMsgRefObj = {
      comments: `404 Error Not Found: No comment with the provided comment_id was found`,
      categories: `404 Error Not Found: No category with the name provided was found`,
      reviews: `404 Error Not Found: No review with the review_id provided was found`,
      users: `404 Error Not Found: No user with the username provided was found`,
    };

    return Promise.reject({
      status: 404,
      msg: errorMsgRefObj[tableName],
    });
  }
};

exports.checkPrimaryKeyIsPositiveInteger = async (inputString, tableName) => {
  // NOTE: not used for username. No specific conditions set for username validation as of yet
  if (/^[\d]+$/.test(inputString)) {
    //pass
  } else {
    errorMsgRefObj = {
      comments: `400 Error Bad Request: invalid comment_id`,
      categories: `400 Error Bad Request: invalid category_id`,
      reviews: `400 Error Bad Request: invalid review_id`,
    };
    return Promise.reject({
      status: 400,
      msg: errorMsgRefObj[tableName],
    });
  }
};
