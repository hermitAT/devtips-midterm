const bcrypt = require('bcrypt');


const findUserByEmail = (email) => {
  // return a user object from the DB when a user with the given Email is found

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
exports.findUserByEmail = findUserByEmail;


const findUserByID = (id) => {
  // return a user object from the DB for when a user with the given ID is found

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
exports.findUserByID = findUserByID;


const newUser = (user) => {
  // functionality to add a new user into the database, hashing the given password, and returning the new user object

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
exports.newUser = newUser;


const login = (email, password) => {
  //^^ log the user into the system with a given email/password, using getUserWithEmail to find the given user in the DB
  // use bcrypt.compareSync to compare passwords, return user object upon successful validation

  return db.getUserWithEmail(email)
    .then(user => {
      if (bcrypt.compareSync(password, user.password)) {
        return user;
      }
      return null;
    });
};
exports.login = login;
