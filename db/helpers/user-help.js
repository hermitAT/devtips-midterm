const bcrypt = require('bcrypt');
const { query } = require('../index');

let queryString;

/*
* return all user objects from database
*
*/
const getAllUsers = () => {
  queryString = `SELECT * FROM users;`;

  return query(queryString)
    .then(data => data.rows)
    .catch(err => console.error('Query error', err.stack));
};
exports.getAllUsers = getAllUsers;

/*
* Return the user object from database with the provided email
*
*/
const findUserByEmail = (email) => {

  queryString = `
    SELECT *
    FROM users
    WHERE email = $1;
    `;

  return query(queryString, [email])
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.findUserByEmail = findUserByEmail;

/*
* Return a user object from database given just the user's ID
*
*/
const findUserByID = (id) => {

  queryString = `
    SELECT *
    FROM users
    WHERE id = $1;
  `;

  return query(queryString, [id])
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.findUserByID = findUserByID;

/*
* Return user object from database given a user 'name'
*
*/
const findUserByName = (name) => {

  queryString = `
    SELECT *
    FROM users
    WHERE name = $1;
    `;

  return query(queryString, [name])
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.findUserByName = findUserByName;

/*
* Create a new user object in the database with their provided their name, email and password
*
*/
const newUser = (userDetails) => {
  // functionality to add a new user into the database, hashing the given password, and returning the new user object

  queryString = `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, $3)
      RETURNING *;
      `;

  return query(queryString, userDetails)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));

};
exports.newUser = newUser;

/*
* Edit details - name, password, and email - for the given user ID
*
*/
const editUser = (userDetails) => {

  queryString = `
    UPDATE users
    SET name = $1, password = $2, email = $3
    WHERE id = $4
    RETURNING *;
  `;

  return query(queryString, userDetails)
    .then(data => data.rows[0])
    .catch(err => console.error('Query error', err.stack));
};
exports.editUser = editUser;

/*
* Login to the app with provided credentials, if they pass the authentication check
*
*/
const login = (email, password) => {
  return findUserByEmail(email)
    .then(data => {
      if (passwordCheck(password, data)) {
        return data;
      }
    })
    .catch(err => console.error('Query error', err.stack));
};
exports.login = login;

/*
* Authentication check for a given password and a user object
*
*/
const passwordCheck = (password, user) => {

  if (!bcrypt.compareSync(password, user.password)) {
    return false;
  }
  return true;
};
exports.passwordCheck = passwordCheck;
