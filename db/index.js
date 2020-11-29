const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'midterm'
});

module.exports = {

  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }

}
