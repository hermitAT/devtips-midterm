/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const bcrypt = require('bcrypt');

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
  // clear cookies in session upon logout, redirect

  router.get('/user/:id', (req, res) => {
    if (!req.session.user_id) {
      res.redirect('/');
    }
    // if no user logged in, redirect to home page

    if (req.session.user_id !== )

    const user_id = req.session.user_id;

    db.query(`
      SELECT * from users
      WHERE id = $1;
      `, [user_id])
      .then(data => {
        const user = data.rows[0];
        res.render('user', { user });
      });
  });

  /*
  router.post('/user/:id', (req, res) => {
    if (req.session.user_id !== req.params.id) {
      res.statusCode(401).render('error');
    }

    const { name, password, email } = req.body;
    const userDetails = [name, password, email, req.session.user_id];

    db.query(`
      UPDATE users
      SET name = $1, password = $2, email = $3
      WHERE id = $4
      RETURNING *;
      `, userDetails)
      .then(data => {
        const user = data.rows[0];
        res.render('user', { user });
      });
  });
  */

  return router;
};
