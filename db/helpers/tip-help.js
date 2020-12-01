
const { query } = require('../');

/**
 * Function receives an array of resource IDs and User ID
 * (may be skipped, user-specific queries will just return null)
 * Returns all fields from resources table
 * related to each resource with their creator names,
 * likes/dislikes, tags related to resource, comments count
 * and user-specific information whether
 * they liked and/or bookmarked a resource
 * @param {*} [resource_id1,...]
 */
const getResourceFullData = function(arr, userID) {

  return Promise.all(arr.map(resource_id => {
    const queryString = `
    SELECT a.*, users.name AS creator_name,
      (SELECT COUNT (likes.id)
      FROM likes
      WHERE value = true AND resource_id  = a.id) AS likes,
      (SELECT COUNT (likes.id)
      FROM likes
      WHERE value = false AND resource_id  = a.id) AS dislikes,
      (SELECT COUNT (comments.id)
      FROM comments
      WHERE resource_id  = a.id) AS comments_count,
      (SELECT STRING_AGG(tag, ' ')
      FROM resources_tags
      JOIN tags ON tag_id = tags.id
      WHERE resource_id  = a.id) AS tags,
      (SELECT likes.id
      FROM likes
      WHERE user_id = $2 AND resource_id  = a.id) AS is_liked,
      (SELECT bookmarks.id
      FROM bookmarks
      WHERE user_id = $2 AND resource_id  = a.id) AS is_bookmarked
    FROM resources a
    JOIN users ON creator_id = users.id
    WHERE a.id  = $1;
    `;
    return query(queryString, [resource_id, userID])
    .then(res => res.rows[0]);
  }))
}
exports.getResourceFullData = getResourceFullData;


/**
 * Returns count of comments the resource has (just count!)
 * for a specific post
 * @param {*} resource_id
 */
const getResourceComments = function(arr) {

  return Promise.all(arr.map(resource_id => {
  const queryString = `
  SELECT user_id, created_at, edited_at, comment
  FROM comments
  WHERE resource_id = $1;
  `;
  return query(queryString, [resource_id])
  .then(res => res.rows[0].count);
  }))
}
exports.getResourceComments = getResourceComments;

