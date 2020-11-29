/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:tip_id", (req, res) => {
    console.log(`Tip id: ${req.params.tip_id}`);
  });
  return router;
};
