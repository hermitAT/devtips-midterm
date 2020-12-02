const { query } = require('../index');

let queryString;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ tip modification helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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
    WHERE id = $1;
  `;

  return query(queryString, values)
    .then(data => console.log("Success! Resource deleted!"))
    .catch(err => console.error('Query error', err.stack));
};
exports.deleteTip = deleteTip;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ like helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
*
*
*/
const setLike = (values) => {

  queryString = `
    INSERT INTO likes (user_id, resource_id, value)
    VALUES ($1, $2, $3)
    RETURNING *;
    `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.setLike = setLike;

/*
*
*
*/
const flipLike = (values) => {

  queryString = `
    UPDATE likes
    SET user_id = $1, resource_id = $2, value = $3
    RETURNING *;
  `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.flipLike = flipLike;

/*
*
*
*/
const unsetLike = (values) => {

  queryString = `
    DELETE FROM likes
    WHERE user_id = $1 AND resource_id = $2
    RETURNING (SELECT id FROM resources WHERE id = $2);
  `;

  return query(queryString, values)
    .then(data => {
      console.log("Success! Like removed!");
      return data.rows[0];
    })
    .catch(err => console.error('Query error', err.stack));
};
exports.unsetLike = unsetLike;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ bookmark helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
*
*
*/
const setBookmark = (values) => {

  queryString = `
    INSERT INTO bookmarks (user_id, resource_id)
    VALUES ($1, $2)
    RETURNING *;
  `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.setBookmark = setBookmark;

/*
*
*
*/
const unsetBookmark = (values) => {

  queryString = `
    DELETE FROM bookmarks
    WHERE user_id = $1 AND resource_id = $2
    RETURNING (SELECT id FROM resources WHERE id = $2);
  `;

  return query(queryString, values)
    .then(data => {
      console.log("Success! Bookmark removed!");
      return data.rows[0];
    })
    .catch(err => console.error('Query error', err.stack));
};
exports.unsetBookmark = unsetBookmark;


// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ comment helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

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

