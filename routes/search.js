/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const dbHelp  = require('../db/db-helpers');

const userID = 4; // There should be UID from cookie

module.exports = () => {

  router.get("/", (req, res) => {
    // const userId = req.session.user_id;
    res.render('search');
    // ^^ add { userId } to the render args..
  });

  router.post("/", (req, res) => {
    dbHelp.searchByTags(req.body.search)
      .then((tips) => res.json(tips));
  });

  return router;
};
