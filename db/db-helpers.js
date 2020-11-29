const { query } = require('./');


const extract = function(rows, column) {

  output = [];
  for (const row of rows) {
    output.push(row[column]);
  }
  return output;

};


/**
 * Returns all fields from resources table
 * related to a certain resource id along with its creator name
 * @param {*} resource_id
 */
const getResourceAndCreator = function(resource_id) {

  const queryString = `
  SELECT resources.*, users.name AS creator_name
  FROM resources
  JOIN users ON creator_id = users.id
  WHERE resources.id  = $1;
  `;
  return query(queryString, [resource_id])
  .then(res => res.rows[0]);

}
exports.getResourceAndCreator = getResourceAndCreator;


/**
 * Returns all tags (as array) related to a specific resource
 * @param {*} resource_id
 */
const getResourceTags = function(resource_id) {

  const queryString = `
  SELECT tag
  FROM resources_tags
  JOIN tags ON tag_id = tags.id
  WHERE resource_id = $1
  `;
  return query(queryString, [resource_id])
  .then(res => {
    console.log(extract(res.rows, 'tag'));
  });

}
exports.getResourceTags = getResourceTags;


/**
 * Returns array with [ total likes, total dislikes ]
 * for a specific post
 * @param {*} resource_id
 */
const getResourceRating = function(resource_id) {

  const queryString = `
  SELECT value, COUNT (likes.id)
  FROM likes
  WHERE resource_id = $1
  GROUP BY value
  `;
  return query(queryString, [resource_id])
  .then(res => {

    const likes = (res.rows[0].value) ? res.rows[0].count : res.rows[1].count;
    const dislikes = (!res.rows[0].value) ? res.rows[0].count : res.rows[1].count;
    return [ likes, dislikes ];

  });

}
exports.getResourceRating = getResourceRating;


/**
 * Returns count of comments the resource has (just count!)
 * for a specific post
 * @param {*} resource_id
 */
const getResourceCommentsCount = function(resource_id) {

  const queryString = `
  SELECT COUNT (comments.id)
  FROM comments
  WHERE resource_id = $1
  `;
  return query(queryString, [resource_id])
  .then(res => res.rows[0].count);

}
exports.getResourceCommentsCount = getResourceCommentsCount;


/**
 * Returns info if a user liked a specific post
 * @param {*} user_id
 * @param {*} resource_id
 */
const isLikedByUser = function(user_id, resource_id) {

  const queryString = `
  SELECT id
  FROM likes
  WHERE  user_id = $1 AND resource_id = $2
  `;
  return query(queryString, [user_id, resource_id])
  .then(res => console.log((res.rows[0]) ? true : false));

}
exports.isLikedByUser = isLikedByUser;

/**
 * Returns info if a user liked a specific post
 * @param {*} user_id
 * @param {*} resource_id
 */
const isBookmarkedByUser = function(user_id, resource_id) {

  const queryString = `
  SELECT id
  FROM bookmarks
  WHERE  user_id = $1 AND resource_id = $2
  `;
  return query(queryString, [user_id, resource_id])
  .then(res => console.log((res.rows[0]) ? true : false));

}
exports.isBookmarkedByUser = isBookmarkedByUser;


const getTagId = function(tag) {
  const queryString = `
  SELECT id
  FROM tags
  WHERE  tag = $1;
  `;
  return query(queryString, [tag])
  .then(res => res.rows)// ? console.log(res.rows[0].id) : undefined);
}


const searchByTags = function(string) {

  const tags = [];
  searchTags = string.trim().split(' ')
  for (const tag of searchTags) {
    console.log(tag)
    getTagId(tag).then((tag) => tags.push(tag));
  }
  console.log(tags)
};

searchByTags('js ajax')
