/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const bcrypt = require('bcrypt');
const router  = express.Router();
const helpers = require('../db/helpers/users.js');

module.exports = (db) => {

  router.get('/login/:id', (req, res) => {
    req.session.user_id = req.params.id;
    res.redirect('/');
  });
  // very simple user login, input ID and submit to login, set cookie to the ID of user
  // redirect to home page upon success

  router.get('/logout', (req, res) => {
    req.session = null;
    res.redirect('/');
  });
  // clear cookies in session upon logout, redirect to home page -> should this be a POST?


  /*
  *
  *

  const login = (db, email, password) => {
    //^^ log the user into the system with a given email/password, using getUserWithEmail to find the given user in the DB
    // use bcrypt.compareSync to compare passwords, return user object upon successful validation
    return helpers.findUserByEmail(db, email)
      .then(user => {
        if (bcrypt.compareSync(password, user.password)) {
          return user;
        }
        return null;
      });
  };

  router.post('/login', (req, res) => {
    const { email, password } = req.body;
    return login(db, email, password)
      .then(user => {
        if (!user) {
          res.json({ error: "Unauthorized" });
        }
        req.session.user_id = user.id;
        res.redirect('/');
      })
      .catch((err) => {
        console.error('Query error', err.stack);
      });
  });
  // ^^ more complicated user login, with given email/password, using hashed password and a redirection to the user/:id page.


  router.post('/register', (req, res) => {
    // register a new user, recieve a user object from the request and pass it thru newUser helper function to add to database
    // return with the new user row from database, set cookie to new user.id and redirect to newly created user/:id page

    const userObj = req.body;
    helpers.newUser(db, userObj)
      .then(user => {
        if (!user) {
          res.send({ error: "User not found!" });
        }
        req.session.user_id = user.id;
        res.redirect('user', user);
      })
      .catch((err) => {
        console.error('Query error', err.stack);
      });
  });
  */

  return router;
};
