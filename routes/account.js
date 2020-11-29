/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/login", (req, res) => {
    console.log(`Login goes here.`);
  });
  router.get("/logout", (req, res) => {
    console.log(`Logout goes here.`);
  });
  router.get("/register", (req, res) => {
    console.log(`Register goes here.`);
  });
  return router;
};
