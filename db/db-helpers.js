const { query } = require('./');


const extract = function(rows, column) {

  output = [];
  for (const row of rows) {
    output.push(row[column]);
  }
  return output;

};


/**
 * Function receives an array of resource IDs
 * Returns all fields from resources table
 * related to each resource with their creator names
 * likes/dislikes, tags related to resource and comments count
 * @param {*} [resource_id1,...]
 */
const getResourceFullData = function(arr) {

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
      WHERE resource_id  = a.id) AS tags
    FROM resources a
    JOIN users ON creator_id = users.id
    WHERE a.id  = $1;
    `;
    return query(queryString, [resource_id])
    .then(res => res.rows[0]);
  }))
}
exports.getResourceFullData = getResourceFullData;


/**
 * Function receives an array of resource IDs and User ID
 * Returns all fields from resources table
 * related to each resource with their creator names,
 * likes/dislikes, tags related to resource, comments count
 * and user-specific information whether
 * they liked and/or bookmarked a resource
 * @param {*} [resource_id1,...]
 */
const getResourceFullDataForUser = function(arr, userID) {

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
exports.getResourceFullDataForUser = getResourceFullDataForUser;


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


/**
 * Transform word to a related tag ID if any
 * @param {*} tag
 */
const getTagId = function(tag) {
  const queryString = `
  SELECT id
  FROM tags
  WHERE  tag = $1;
  `;
  return query(queryString, [tag])
  .then(res => res.rows[0] ? res.rows[0].id : undefined);
};
exports.getTagId = getTagId;

/**
 * The function receives string from the search field
 * string splitted by space chars or commas and
 * each word transformed to related tag ID
 * then depending on number of tag IDs the search query formed
 * Function returns array of resource IDs which have ALL
 * tags user searched for (if any)
 * @param {*} string
 */
const searchByTags = function(string) {

  const tags = [];
  searchTags = string.trim().split(/[\s,]+/)

  return Promise.all(searchTags.map((el) => getTagId(el)))
    .then((res) => {
      let code = 97;
      const [froms, wheres, ands] = [[], [], []];
      while (code < 97 + res.length) {
        froms.push(`resources_tags ${String.fromCharCode(code)}`);
        wheres.push(`${String.fromCharCode(code)}.tag_id = $${code - 96}`);
        ands.push((code != 97) ? `${String.fromCharCode(code - 1)}.resource_id = ${String.fromCharCode(code)}.resource_id`: ' ');
        code++;
      }

      const queryString = `
      SELECT a.resource_id
      FROM ${froms.join(', ')}
      WHERE ${wheres.join(' AND ')}
      ${ands.join(' AND ')};
      `
      return query(queryString, res)
      .then(res => extract(res.rows, 'resource_id'))
    })

};
exports.searchByTags = searchByTags;


/**
 * Function receives array (e.g. resource IDs)
 * and offset (default is 20)
 * Returns object like {1:[id1, id2...], 2:[id21, id22...]}
 * @param {*} arr
 * @param {*} offset
 */
const pager = function(arr, offset = 20) {

  const pages = {};
  let page = 1;
  const lastPage = Math.ceil(arr.length / offset)
  while (page <= lastPage) {
    pages[page] = arr.slice(offset * (page -1) ,offset * page);
    page++;
  }
  return pages;

}
exports.pager = pager;
