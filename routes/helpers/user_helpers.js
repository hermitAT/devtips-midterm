const bcrypt = require('bcrypt');

const getUserWithEmail = (email) => {

  return db.query(`SELECT * FROM users WHERE email = $1;`, [email])
    .then(data => {
      if (!data.rows[0]) {
        return null;
      }
      return data.rows[0];
    })
    .catch((err) => {
      console.error('Query error', err.stack);
    });
};
// ^^ return a user object from the DB when a user with the given Email is found


const getUserWithId = (id) => {
  return db.query(`SELECT * FROM users WHERE id = $1;`, [id])
    .then(data => {
      if (!data.rows[0]) {
        return null;
      }
      return data.rows[0];
    })
    .catch((err) => {
      console.error('Query error', err.stack);
    });
};
// ^^ return a user object from the DB for when a user with the given ID is found


const addUser = (user) => {
  user.password = bcrypt.hashSync(user.password, 12);
  const values = [user.name, user.email, user.password];

  return db.query(`INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;`, values)
    .then(data => {
      if (!data.rows[0]) {
        return null;
      }
      return data.rows[0];
    })
    .catch((err) => {
      console.error('Query error', err.stack);
    });
};
// ^^ functionality to add a new user into the database, hashing the given password, and returning the new user object


const login = (email, password) => {
  return db.getUserWithEmail(email)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
};
//^^ log the user into the system with a given email/password, using getUserWithEmail to find the given user in the DB
// use bcrypt.compareSync to compare passwords, return user object upon successful validation

module.exports = {
  getUserWithEmail,
  getUserWithId,
  addUser,
  login
};
