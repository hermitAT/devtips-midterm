/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const searchHelp  = require('../db/helpers/search-help')
const userID = 4; // There should be UID from cookie
const querystring = require('querystring');

module.exports = () => {


  // Get list of currently valid tags
  router.get("/tags", (req, res) => {
    searchHelp.getTagsList()
      .then(tags => res.json(tags))
  });


  router.post("/", (req, res) => {
    searchHelp.searchByTags(req.body.search)
    .then((tips) => res.json(tips))
  });

  router.get("/", (req, res) => {
    res.render('search')
    // ^^ add { userId } to the render args..
  });

  return router;

};
