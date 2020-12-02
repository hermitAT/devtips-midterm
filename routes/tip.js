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

    const tip_id = req.params.tip_id;
    console.log(`tip_id: ${tip_id}`);

    const tipQueryString = 'SELECT * FROM resources WHERE id = $1;';
    const commentQueryString = 'SELECT * FROM comments WHERE resource_id = $1;';


    const tip = db.query(tipQueryString, [tip_id]);
    const comment = db.query(commentQueryString, [tip_id]);

    Promise.all([tip, comment]).then((result) => {
      const tip = result[0].rows[0];
      const comment= result[1].rows;
      console.log('tips: ', tip);
      console.log('comments: ', comment);
      res.render('tip', { tip_id, tip, comment});
    });


  });
  // send resource with particular :tip_id to server as JSON


  router.post("/:tip_id", (req, res) => {

    const values = [res.body.title, res.body.description, res.body.type];
    const tipId = res.body.tip_id;
    const userId = req.session.user_id;

    if (!userId) {
      res.json({ error: "Unauthorized!" });
    }
    // if no user is logged in, send error of unauthorized

    db.query(`SELECT creator_id FROM resources WHERE id = $1`, tipId)
      .then(data => {
        const creator = data.rows[0]["creator_id"];
        // ^^ select the creator_id from the resource from the DB, get the value and compare to userId below as validation check
        if (creator !== userId) {
          res.json({ error: "Unauthorized!" });
        }
      })
      .catch(err => res.json({ success: false, error: err }));

    // if validation passes, take new values for title, desc, type and set them and apply value Now() for edited_at
    db.query(`
      UPDATE resources
      SET title = $1, description = $2, type = $3, edited_at = Now()
      WHERE id = $4
      RETURNING *`, values)
      .then(data => res.json(data.rows[0]))
      .catch(err => res.json({ success: false, error: err }));
  });

  router.post("/:tip_id/:like"), (req, res) => {
    const values = [res.body.tip_id, req.session.user_id, res.body.boolean];

    db.query(`
    UPDATE likes
    SET resource_id = $1, user_id = $2, boolean = $3
    RETURNING *;
    `, values)
      .then(data => {
        res.json(data.rows[0]);
      })
      .catch(err => res.json({ success: false, error: err }));
  };
  // recieve boolean from submission, apply it to new like and link resource_id and user_id to the new like.
  // redirect to the resource page? not sure where to go after updating the table.


  // same issue below with :bookmark, unsure where to go or what to send to server once the bookmark has been applied...
  router.post("/:tip_id/:bookmark"), (req, res) => {
    const values = [res.body.tip_id, req.session.user_id];

    db.query(`
    UDPDATE bookmarks
    SET resource_id = $1, user_id = $2
    RETURNING *;
    `, values)
      .then(data => {
        res.json(data.rows[0]);
      })
      .catch(err => res.json({ success: false, error: err }));
  };


  // likely take the user validation step and put that into a helper function!
  router.post("/:tip_id/delete"), (req, res) => {
    const tipId = res.body.tip_id;
    const userId = req.session.user_id;

    if (!userId) {
      res.send({ error: "Unauthorized!" });
    }
    // if no user is logged in, send error of unauthorized

    db.query(`SELECT creator_id FROM resources WHERE id = $1`, tipId)
      .then(data => {
        const creator = data.rows[0].creator_id;
        // ^^ select the creator_id from the resource from the DB, get the value and compare to userId below as validation check
        if (creator !== userId) {
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
