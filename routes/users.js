/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();

module.exports = (db) => {

  router.get('/login', (req, res) => {
    const { email, password } = req.body;
    db.login(email, password)
      .then(user => {
        if (!user) {
          res.error(401).render('error', { error: "Unauthorized" });
        }
        req.session.user_id = user.id;
        res.redirect('/user/:id', user);
      })
      .catch((err) => {
        console.error('Query error', err.stack);
      });
  });
  // ^^ more complicated user login, with given email/password, using hashed password and a redirection to the user/:id page.

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


  router.post('/register', (req, res) => {
    const userObj = req.body;
    db.addUser(userObj)
      .then(user => {
        if (!user) {
          res.status(404).render('error', { error: "User not found!" });
        }
        req.session.user_id = user.id;
        res.redirect('user', user);
      })
      .catch((err) => {
        console.error('Query error', err.stack);
      });
  });


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
    db.getUserWithId(userID)
      .then(user => {
        if (!user) {
          res.status(404).render('error', { error: "No user with that ID!" });
        }
        res.render('user', user);
      });
  });

  return router;
};


// return to this route later... editing user details...
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
