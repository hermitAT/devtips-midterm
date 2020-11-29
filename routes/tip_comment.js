/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/:tip_id/:comment_id", (req, res) => {
    console.log(`tip_id: ${req.params.tip_id} comment_id: ${req.params.comment_id}`);
  });
  return router;
};
