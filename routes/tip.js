/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const dbHelp = require('../db/db-helpers');

const userID = 4 // There should be UID from cookie

module.exports = (db) => {

    router.post("/", (req, res) => {
      const { tipsID } = req.body;
      dbHelp.getResourceFullData(tipsID, userID)
        .then((tips) => res.json(tips))
    });

  router.get("/:tip_id", (req, res) => {
    console.log(`Tip id: ${req.params.tip_id}`);
  });



  return router;
};
