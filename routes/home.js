/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const homeHelp = require('../db/helpers/home-help')


module.exports = (db) => {

  router.get("/", (req, res) => {
    // const tipsQueryString = 'SELECT * FROM resources AS r JOIN users AS u ON u.id = r.creator_id ORDER BY r.created_at LIMIT 30;';
    // const tips = db.query(tipsQueryString);
    // Promise.all([tips]).then((result) => {
    //   const tips = result[0].rows;
    //   res.render('index', { tips});
    // });

    const userID = '4'; // MUST BE TAKEN FROM COOKIE!
    res.render('index', { userID });
  });

  /** Upload a new tip to DB User ID passed to helper for
   * security check is used to avoid "CURLing from outside" */
  router.post("/", (req, res) => {
    //Check that user is authenticated
    if (!res.locals.user.id) {
      return res.status(401)
        .json({
          err: {
            status: 401,
            message: 'Unauthorized'
          }
        });
    }
    //Build query and send to database
    const queryString = `
    INSERT INTO resources (url, title, description, type, creator_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id;
    `
    console.log(req.body);
    const { url, title, description, type } = req.body;
    db.query(queryString, [url, title, description, type, res.locals.user.id])
      .then(tipData => res.json(tipData.rows[0]) ) // Return id of inserted tip
      .catch(err => res.status(401).json({err: err})); // Return err JSON on failure
  });

  return router;
};
