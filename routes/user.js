/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const helpers = require('../db/helpers/user-helpers');

module.exports = (db) => {

  router.get('/user/:id', (req, res) => {
    const userID = req.session.user_id;

    if (!userID) {
      res.redirect('/');
    }
    // if no user logged in, redirect to home page

    if (userID !== req.params.id) {
      res.status(401).render('error', { error: "Unauthorized!" });
    }
    // if current active user is not the user/:id in question, set status to 401 and render the 'error' page

    // when it is determined that active user is authorized to view page, use ID to return the user object from the DB
    // pass it into the res.render fn
    helpers.findUserByID(userID)
      .then(user => {
        if (!user) {
          res.status(404).render('error', { error: "No user with that ID!" });
        }
        res.render('user', user);
      });
  });


  router.post('/user/:id', (req, res) => {
    // check if active user is the user/:id in question by comparing to session.user_id

    if (req.session.user_id !== req.params.id) {
      res.statusCode(401).render('error', { error: "Unauthorized!"});
    }

    const { name, password, email } = req.body;
    const hashPassword = bcrypt.hashSync(password, 12);
    const userDetails = [name, hashPassword, email, req.session.user_id];

    // update the user row within the database, and render user/:id with the updated information
    helpers.editUser(userDetails)
      .then(user => {
        res.render('user', user);
      });
  });
  return router;
};
