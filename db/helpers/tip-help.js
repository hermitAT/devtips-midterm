const { query } = require('../index');

let queryString;

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

const likeTip = (values) => {

  queryString = `
    INSERT INTO likes (user_id, resource_id, value)
    VALUES ($1, $2, $3)
    RETURNING (SELECT * FROM resources WHERE id = $2);
    `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.likeTip = likeTip;

const addBookmark = (values) => {

  queryString = `
    UPDATE bookmarks (user_id, resource_id)
    VALUES ($1, $2)
    RETURNING (SELECT * FROM resources WHERE id = $2);
  `;

  return query(queryString, values)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.addBookmark = addBookmark;


