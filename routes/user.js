/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const helpers = require('../db/helpers/user-help.js');

module.exports = (db) => {

  router.get('/', (req, res) => {
    helpers.getAllUsers()
      .then(users => {
        res.json({ users });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  // ^^ return JSON containing all users in database

  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    return helpers.login(email, password)
      .then(data => {
        if (!data) {
          res.json({ error: "Unauthorized" });
        }
        req.session.user_id = data.id;
        res.redirect('/');
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });
  // ^^ check if user with given email is in database, and check PW hash before setting cookie and redirecting to homepage

  router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });
  // clear cookies in session upon logout, redirect to home page

  router.get('/login/:id', (req, res) => {
    req.session.user_id = req.params.id;
    res.redirect('/');
  });
  // very simple user login, input ID and submit to login, set cookie to the ID of user
  // redirect to home page upon success

  router.get('/:id', (req, res) => {
    const userID = req.params.id;

    helpers.findUserByID(userID)
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
    helpers.editUser(userDetails)
      .then(user => {
        res.json({ user });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post('/register', (req, res) => {
    const { name, password, email } = req.body;
    const hashPassword = bcrypt.hashSync(password, 12);
    const userDetails = [name, hashPassword, email];

    helpers.newUser(userDetails)
      .then(user => {
        res.json({ user });
      })
      .catch(err => {
        res.status(500).json({ error: err.message });
      });
  });

  return router;
};
