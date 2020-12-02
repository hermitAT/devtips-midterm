const { query } = require('../index');

let queryString;

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~ tip modification helpers ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

/*
* Edit the title & description of a given Tip ID, && edited_at is set to Now(), return the updated Tip object
* Parameters are the updated title, description and the Tip ID to update
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
* Delete all details for a given Tip ID && log a succesful deletion to the console.
* Params in values is only the resource.id in question
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
* Create a 'like' for the given user/resource pair, and assign the given value to the boolean field
* Params are the active user, the Tip ID, and the given boolean value (0 creates a falsey (dislike), 1 creates a truthy (like))
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
* When Tip is already 'liked' by the active user, flip the boolean value stored in the table.
* Params are active user, Tip ID, and the boolean value (which will always be falsey)
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
* Removes all likes that have been set for the user/tip pair (if multiple have been created due to seeds, otherwise, etc)
* Params are the active user and the Tip Id, the Tip Id is the data returned.
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
* create a new bookmark for the user/tip pair
* Params are the user/tip id pair
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
* Remove the bookmark set for the user/tip pair
* Params are the user/tip id pair
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
* Create a new comment for a given tipID, created by the active user
* Params are the user/tip id pair and the comment text
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
* Delete a comment with a given id
* Param is the id of the comment to be deleted
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
* Edit the text of a comment, and create an edited_at value of Now()
* Params are the comment id and the comment text to input
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
