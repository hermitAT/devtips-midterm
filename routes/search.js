/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
<<<<<<< HEAD
const searchHelp  = require('../db/helpers/search-help')
=======
const dbHelp  = require('../db/db-helpers');
>>>>>>> origin/DEV

const userID = 4; // There should be UID from cookie

module.exports = () => {
<<<<<<< HEAD

  // Get list of currently valid tags
  router.get("/tags", (req, res) => {
    searchHelp.getTagsList()
      .then(tags => res.json(tags))
  });

  router.get("/", (req, res) => {
    res.render('test-search');
  });

  router.post("/", (req, res) => {
    searchHelp.searchByTags(req.body.search)
    .then((tips) => res.json(tips))
=======

  router.get("/", (req, res) => {
    // const userId = req.session.user_id;
    res.render('search');
    // ^^ add { userId } to the render args..
  });

  router.post("/", (req, res) => {
    dbHelp.searchByTags(req.body.search)
      .then((tips) => res.json(tips));
>>>>>>> origin/DEV
  });

  return router;
};
