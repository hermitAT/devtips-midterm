/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const dbHelp  = require('../db/db-helpers')

module.exports = (db) => {

  router.get("/", (req, res) => {
    console.log(`Search goes here.`);
    res.render('search')
  });

  //router.post("/get-tips", (req, res) => {
  //  dbHelp.getResourceFullData(req.body.tipsID)
  //    .then((tips) => res.json(tips))
  //});

  router.post("/get-tips", (req, res) => {
    const { tipsID, userID } = req.body;
    console.log(tipsID, userID)
    dbHelp.getResourceFullData(tipsID, userID)
      .then((tips) => res.json(tips))
  });

  return router;
};
