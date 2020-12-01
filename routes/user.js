/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const helpers = require('../db/helpers/users.js');

module.exports = (db) => {

  router.get('/', (req, res) => {
    helpers.getAllUsers(db)
      .then(users => {
        res.json({ users });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get('/:id', (req, res) => {
    const userID = req.params.id;

    helpers.findUserByID(db, userID)
      .then(user => res.json({ user }))
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });


  router.post('/edit/:id', (req, res) => {

    const { name, password, email } = req.body;
    const hashPassword = bcrypt.hashSync(password, 12);
    const userDetails = [name, hashPassword, email, req.params.id];

    // update the user row within the database, and render user/:id with the updated information
    helpers.editUser(db, userDetails)
      .then(user => {
        res.json({ user });
      });
  });
  return router;
};
