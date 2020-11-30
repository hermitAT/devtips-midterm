const { query } = require('../');

const extract = function(rows, column) {

  const output = [];
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
};
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
      extract(res.rows, 'tag');
    });
};
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
      return [likes, dislikes];

    });
};
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
};
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
    .then(res => (res.rows[0]) ? true : false);
};
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
    .then(res => (res.rows[0]) ? true : false);
};
exports.isBookmarkedByUser = isBookmarkedByUser;

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
  const searchTags = string.trim().split(/[\s,]+/);

  return Promise.all(searchTags.map((el) => getTagId(el)))
    .then((res) => {
      let code = 97;
      const [froms, wheres, ands] = [[], [], []];
      while (code < 97 + res.length) {
        froms.push(`resources_tags ${String.fromCharCode(code)}`);
        wheres.push(`${String.fromCharCode(code)}.tag_id = $${code - 96}`);
        ands.push((code !== 97) ? `${String.fromCharCode(code - 1)}.resource_id = ${String.fromCharCode(code)}.resource_id` : ' ');
        code++;
      }

      const queryString = `
      SELECT a.resource_id
      FROM ${froms.join(', ')}
      WHERE ${wheres.join(' AND ')}
      ${ands.join(' AND ')}
      `;
      return query(queryString, res)
        .then(res => extract(res.rows, 'resource_id'));
    });
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
  const lastPage = Math.ceil(arr.length / offset);
  while (page <= lastPage) {
    pages[page] = arr.slice(offset * (page - 1), offset * page);
    page++;
  }
  return pages;
};
exports.pager = pager;
