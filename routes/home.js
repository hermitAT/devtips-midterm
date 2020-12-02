/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const homeHelp = require('../db/helpers/home-help')
const userID = '4'; // MUST BE TAKEN FROM COOKIE!

module.exports = () => {

  router.get("/", (req, res) => {
    res.render('index');
  });

  /** Upload a new tip to DB User ID passed to helper for
   * security check is used to avoid "CURLing from outside" */
  router.post("/", (req, res) => {

    return homeHelp.createNewTip(req.body.tip, userID)
      //.then(tipID => tipID)
      .then(tipID => res.redirect(`/tip/${tipID}`));

  });

  return router;
};
