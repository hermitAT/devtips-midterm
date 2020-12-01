const {db} = require('../server');

module.exports = {

  query: (text, params, callback) => {
    return db.query(text, params, callback);
  }
};
