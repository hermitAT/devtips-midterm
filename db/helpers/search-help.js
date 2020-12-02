const { query, extract } = require('../');


/**
 * Get an array of currently valid tags
 */
const getTagsList = function() {

  const queryString = `
  SELECT tag FROM tags`;
  return query(queryString)
    .then(res => extract(res.rows, 'tag'));

};
exports.getTagsList = getTagsList;


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
const searchByTags = function(searchTags) {

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

