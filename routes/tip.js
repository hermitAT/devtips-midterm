/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router = express.Router();
const dbHelp = require('../db/db-helpers');
const tipHelp = require('../db/helpers/tip-help');

const userID = 4;
// There should be UID from cookie


module.exports = () => {

  router.post("/", (req, res) => {
    const { tipsID } = req.body;
    dbHelp.getResourceFullData(tipsID, userID)
      .then((tips) => res.json(tips));
  });

  router.get("/:tip_id", (req, res) => {

    const tipId = req.params.tip_id;

    dbHelp.getResourceFullData([tipId], userID)
      .then(data => res.json(data))
      .catch(err => res.json({ error: err.message }));
  });
  // send resource with particular :tip_id to server as JSON

  /*
  *
  *
  */
  // try to implement checkValidation later, refactoring to come...
  router.post("/:tip_id/delete", (req, res) => {
    const tipId = req.params.tip_id;

    // once validation check is passed, delete all columns for the given resource_id
    tipHelp.deleteTip(tipId)
      .then(data => res.redirect('/'))
      .catch(err => res.json({ success: false, error: err }));
  });

  /*
  *
  *
  */
  router.post("/:tip_id/bookmark", (req, res) => {
    const values = [req.body.user_id, req.params.tip_id];

    tipHelp.addBookmark(values)
      .then(data => res.json(data))
      .catch(err => res.json({ success: false, error: err }));
  });

  /*
  *
  *
  */
  router.post("/:tip_id/like", (req, res) => {
    const values = [req.body.user_id, req.params.tip_id, req.body.value];

    tipHelp.likeTip(values)
      .then(data => res.json(data))
      .catch(err => res.json({ success: false, error: err }));
  });
  // recieve boolean from submission, apply it to new like and link resource_id and user_id to the new like.
  // return the new row from likes

  /*
  *
  *
  */
  router.post('/:tip_id/comment', (req, res) => {
    const values = [req.body.user_id, req.params.tip_id, req.body.comment];

    tipHelp.addComment(values)
      .then(data => res.json(data))
      .catch(err => res.json({ success: false, error: err }));
  });

  /*
  *
  *
  */
  router.post("/:tip_id", (req, res) => {

    const values = [req.body.title, req.body.description, req.body.type, req.params.tip_id];

    tipHelp.editTip(values)
      .then(data => res.json(data))
      .catch(err => res.json({ success: false, error: err.message }));
  });



  return router;
};
