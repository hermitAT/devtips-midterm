const {db} = require('../server');

module.exports = {

  query: (text, params, callback) => {
    return db.query(text, params, callback);
  },


  extract(rows, column) {
    return rows.map(row => row[column]);
  }
};
