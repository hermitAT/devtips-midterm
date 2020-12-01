/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const homeHelp = require('../db/helpers/home-help')

module.exports = () => {

  router.get("/", (req, res) => {
    res.render('index');
  });

  // Upload a new tip to DB
  router.post("/", (req, res) => {

    //

  });

  return router;
};
