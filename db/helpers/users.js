const bcrypt = require('bcrypt');

let queryString;

const getAllUsers = (db) => {
  queryString = `SELECT * FROM users;`;

  return db.query(queryString)
    .then(data => data.rows)
    .catch(err => console.error('Query error', err.stack));
};
exports.getAllUsers = getAllUsers;


const findUserByEmail = (db, email) => {
  // return a user object from the DB when a user with the given Email is found

  queryString = `
    SELECT *
    FROM users
    WHERE email = $1;
    `;

  return db.query(queryString, [email])
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.findUserByEmail = findUserByEmail;


const findUserByID = (db, id) => {
  // return a user object from the DB for when a user with the given ID is found

  queryString = `
    SELECT *
    FROM users
    WHERE id = $1;
  `;

  return db.query(queryString, [id])
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.findUserByID = findUserByID;


const findUserByName = (db, name) => {
  // return a user object from the DB for when a user with the given ID is found

  queryString = `
    SELECT *
    FROM users
    WHERE name = $1;
    `;

  return db.query(queryString, [name])
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.findUserByName = findUserByName;


const newUser = (db, user) => {
  // functionality to add a new user into the database, hashing the given password, and returning the new user object
  const { name, email, password } = user;

  if (!findUserByName(name) && !findUserByEmail(name)) {

    const hashPassword = bcrypt.hashSync(password, 12);
    const values = [name, email, hashPassword];
    queryString = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `;

    return db.query(queryString, values)
      .then(data => data.rows[0])
      .catch(err => console.error('Query error', err.stack));
  }
};
exports.newUser = newUser;


const editUser = (db, userDetails) => {
  // edit user details, recieve full set of into on user (name, email, pw, id) within an array, and just apply those values to the UPDATE query
  // return the newly updated user details and render the user/:id page
  // assumes user must submit changes to all 3 parameters ...

  queryString = `
    UPDATE users
    SET name = $1, password = $2, email = $3
    WHERE id = $4
    RETURNING *;
  `;

  return db.query(queryString, userDetails)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.editUser = editUser;
