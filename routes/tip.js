/*
 * All routes for Tips/Resources are defined here
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
const dbHelp = require('../db/db-helpers');
const tipHelp = require('../db/helpers/tips');

const userID = 4;
// There should be UID from cookie


module.exports = (db) => {

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


  router.post("/:tip_id", (req, res) => {

    const values = [req.body.title, req.body.description, req.body.type, req.params.tip_id];

    tipHelp.editTip(values)
      .then(data => res.json(data))
      .catch(err => res.json({ success: false, error: err.message }));
  });

  /*
  *
  */

  router.post("/:tip_id/like"), (req, res) => {
    const values = [userID, req.params.tip_id, req.body.value];

    tipHelp.likeTip(values)
      .then(data => res.json(data))
      .catch(err => res.json({ success: false, error: err }));
  };
  // recieve boolean from submission, apply it to new like and link resource_id and user_id to the new like.
  // redirect to the resource page? not sure where to go after updating the table.


  // same issue below with :bookmark, unsure where to go or what to send to server once the bookmark has been applied...
  router.post("/:tip_id/bookmark"), (req, res) => {
    const values = [userID, req.params.tip_id];

    tipHelp.addBookmark(values)
      .then(data => data)
      .catch(err => res.json({ success: false, error: err }));
  };


  // try to implement checkValidation later, refactoring to come...
  router.post("/:tip_id/delete"), (req, res) => {
    const tipId = req.params.tip_id;

    if (!userID) {
      res.send({ error: "Unauthorized!" });
    }
    // if no user is logged in, send error of unauthorized

    db.query(`SELECT creator_id FROM resources WHERE id = $1`, tipId)
      .then(data => {
        const creator = data.rows[0].creator_id;
        // ^^ select the creator_id from the resource from the DB, get the value and compare to userId below as validation check
        if (creator !== userID) {
          res.send({ error: "Unauthorized!" });
        }
      })
      .catch(err => res.json({ success: false, error: err }));

    // once validation check is passed, delete all columns for the given resource_id
    db.query(`DELETE FROM resources WHERE resource_id = $1;`, tipId)
      .then(data => {
        res.json({ success: true });
        res.redirect('/');
      })
      .catch(err => res.json({ success: false, error: err }));
  };

  return router;
};
