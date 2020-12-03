const { query } = require('../');
const querystring = require('querystring');
const { getTagId } = require('./search-help');


/**
 * 1. Function receives new tip in serialized form and an ID of user
 *    who called '/' POST (for security check)
 * 2. Decode tip and perform security check
 * 3. Extract properities from tip object
 * 4. Call the INSERT query
 * 5. If the new tip has any tags - call the tag-inserting function
 * 6. Return the new tip ID
 * @param {*} tipSerialized
 * @param {*} userID
 */
const createNewTip = function(tipSerialized, userID) {
  const tip = querystring.parse(decodeURI(tipSerialized).replace(/&amp;/g, '&'));

  // Wrap if 'tags' is just a single value, wrap it in array to aviod
  // falure tags.map inside assignTags function
  if (tip.tags && !Array.isArray(tip.tags)) tip.tags = [tip.tags];

  const { data, title, description, type, } = tip;
  const creator_id = userID;
  const queryString = `
  INSERT INTO resources (data, title, description, type, creator_id)
  VALUES ($1, $2, $3, $4, $5)
  RETURNING id;
  `;
  return query(queryString, [ data, title, description, type, creator_id ])
    .then(res => {
      if (!tip.tags) return res.rows[0].id;
      return assignTags(res.rows[0].id, tip.tags);
    });
};
exports.createNewTip = createNewTip;


/**
 * 1. Function receives the new tip ID and an array of tag(s)
 * 2. Tag(s) transformed to relatad IDs
 * 3. A separate INSERT query for each tagID is called
 * 4. Return just the new tip ID
 * @param {*} tipID
 * @param {*} tags
 */
const assignTags = function(tipID, tags) {

  return Promise.all(tags.map(el => getTagId(el)))

    .then(res => {
      return Promise.all(res.map(tagID => {

        const queryString = `
        INSERT INTO resources_tags (resource_id, tag_id)
        VALUES ($1, $2);
        `;
        return query(queryString, [ tipID, tagID ]);

      }));
    })
    .then(() => tipID);
};
