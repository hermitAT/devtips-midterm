const { query } = require('../index');

let queryString;

/*
*
*
*/
const editTip = (values) => {

  queryString = `
    UPDATE resources
    SET title = $1, description = $2, edited_at = Now()
    WHERE id = $3
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
const deleteTip = (values) => {

  queryString = `
    DELETE FROM resources
    WHERE id = $1
    RETURNING *;
  `;

  return query(queryString, values)
    .then(data => console.log("Success! Resource deleted!"))
    .catch(err => console.error('Query error', err.stack));
};
exports.deleteTip = deleteTip;

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
const deleteComment = (values) => {

  queryString = `
    DELETE FROM comments
    WHERE id = $1;
  `;

  return query(queryString, values)
    .then(data => console.log("Success! Comment deleted!"))
    .catch(err => console.error('Query error', err.stack));
};
exports.deleteComment = deleteComment;

/*
*
*
*/
const editComment = (values) => {

  queryString = `
    UPDATE comments
    SET comment = $1, edited_at = Now()
    WHERE id = $2
    RETURNING *;
  `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.editComment = editComment;

