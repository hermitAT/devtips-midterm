/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const dbHelp  = require('../db/db-helpers')

const userID = 4 // There should be UID from cookie

module.exports = (db) => {

  router.get("/", (req, res) => {
    console.log(`Search goes here.`);
    res.render('search')
  });

  router.post("/", (req, res) => {
    //console.log(req.body);
    dbHelp.searchByTags(req.body.search)
    .then((tips) => res.json(tips))
  });

  router.post("/get-tips", (req, res) => {
    const { tipsID } = req.body;
    //console.log(tipsID, userID)
    dbHelp.getResourceFullData(tipsID, userID)
      .then((tips) => res.json(tips))
  });

  return router;
};
