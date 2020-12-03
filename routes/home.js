/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const homeHelp = require('../db/helpers/home-help')
const userID = '4'; // MUST BE TAKEN FROM COOKIE!

module.exports = (db) => {

  router.get("/", (req, res) => {
    const tipsQueryString = 'SELECT * FROM resources AS r JOIN users AS u ON u.id = r.creator_id ORDER BY r.created_at LIMIT 30;';
    const tips = db.query(tipsQueryString);
    Promise.all([tips]).then((result) => {
      const tips = result[0].rows;
      res.render('index', { tips});
    });
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
