const { query } = require('./');

const getResourceAndCreator = function(resource_id) {

  const queryString = `
  SELECT resources.*, users.name AS creator_name
  FROM resources
  JOIN users ON creator_id = users.id
  WHERE resources.id  = $1;
  `;
  return query(queryString, [resource_id])
  .then(res => console.log(res.rows[0]));

}



const getResourceTags = function(resource_id) {

  const queryString = `
  SELECT tag
  FROM resources_tags
  JOIN tags ON tag_id = tags.id
  WHERE resource_id = $1
  `;
  return query(queryString, [resource_id])
  .then(res => console.log(res.rows));

}


getResourceTags(14);
