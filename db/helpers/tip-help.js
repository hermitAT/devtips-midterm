const { query } = require('../index');

let queryString;

/*
*
*
*/
const creatorValidation = (tipID) => {

  queryString = `
    SELECT creator_id
    FROM resources
    WHERE id = $1;
    `;

  return query(queryString, tipID)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.creatorValidation = creatorValidation;

/*
*
*
*/
const editTip = (values) => {

  queryString = `
    UPDATE resources
    SET title = $1, description = $2, type = $3, edited_at = Now()
    WHERE id = $4
    RETURNING *;
    `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.editTip = editTip;

/*
*
*
*/
const likeTip = (values) => {

  queryString = `
    INSERT INTO likes (user_id, resource_id, value)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.likeTip = likeTip;

/*
*
*
*/
const addBookmark = (values) => {

  queryString = `
    INSERT INTO bookmarks (user_id, resource_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.addBookmark = addBookmark;


/*
*
*
*/
const addComment = (values) => {

  queryString = `
    INSERT INTO comments (user_id, resource_id, comment)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.addComment = addComment;


/*
*
*
*/
const deleteTip = (tipID) => {

  queryString = `
    DELETE FROM resources
    WHERE id = $1
    RETURNING *;
  `;

  return query(queryString, [tipID])
    .then(data => console.log("Success! Resource deleted!"))
    .catch(err => console.error('Query error', err.stack));
};
exports.deleteTip = deleteTip;

