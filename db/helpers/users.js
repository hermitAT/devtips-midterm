const bcrypt = require('bcrypt');
const { query } = require('../index');

let queryString;

const getAllUsers = () => {
  queryString = `SELECT * FROM users;`;

  return query(queryString)
    .then(data => data.rows)
    .catch(err => console.error('Query error', err.stack));
};
exports.getAllUsers = getAllUsers;


const findUserByEmail = (email) => {
  // return a user object from the DB when a user with the given Email is found

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


const findUserByID = (id) => {
  // return a user object from the DB for when a user with the given ID is found

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


const findUserByName = (name) => {
  // return a user object from the DB for when a user with the given ID is found

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


const editUser = (userDetails) => {
  // edit user details, recieve full set of into on user (name, email, pw, id) within an array, and just apply those values to the UPDATE query
  // return the newly updated user details and render the user/:id page
  // assumes user must submit changes to all 3 parameters ...

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


const login = (email, password) => {
  //^^ log the user into the system with a given email/password, using getUserWithEmail to find the given user in the DB
  // use bcrypt.compareSync to compare passwords, return user object upon successful validation
  return findUserByEmail(email)
    .then(data => {
      if (passwordCheck(password, data)) {
        return data;
      }
    })
    .catch(err => console.error('Query error', err.stack));
};
exports.login = login;

const passwordCheck = (password, user) => {

  if (!bcrypt.compareSync(password, user.password)) {
    return false;
  }
  return true;
};
exports.passwordCheck = passwordCheck;
