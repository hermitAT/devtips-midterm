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

/*

user authentication logic, to be implemented on all routes requiring it ~~~

if (req.session.user_id === req.body.creator_id) {
      <route logic & query goes here>
}

OR

if (req.session.user_id !== req.body.creator_id) {
      <send error to client re: unauthorized>
}

*/

module.exports = () => {

  /*
  *
  *
  */
  router.post("/", (req, res) => {
    const { tipsID } = req.body;
    dbHelp.getResourceFullData(tipsID, userID)
      .then((tips) => res.json(tips));
  });

  /*
  * render 'tip' EJS page, passing thru the given tipId
  *
  */
  router.get("/:tip_id", (req, res) => {

    const tipId = req.params.tip_id;

    console.log(`tip_id: ${tipId}`);
    res.render('tip', { tipId });
  });

  /*
  * (should be DELETE) POST req to remove a tip from the resources table
  * must add user authentication !!!
  */
  router.post("/:tip_id/delete", (req, res) => {
    const tipId = [req.params.tip_id];

    tipHelp.deleteTip(tipId)
      .then(data => res.redirect('/'))
      .catch(err => res.json({ success: false, error: err }));
  });

  /*
  * POST req to mark a tip as bookmarked by the active user
  * user_id will come from login/cookie mechanism, not hardcoded once implemented
  */
  router.post("/:tip_id/bookmark", (req, res) => {
    const { value, is_bookmarked} = req.body;
    const tipId =  req.params.tip_id;
    // const userID = req.session.user_id
    const values = [userID, tipId];

    if (value === "0") {

      tipHelp.unsetBookmark(values)
        .then(data => res.json(data))
        .catch(err => res.json({ success: false, error: err }));
    } else if (is_bookmarked === "false") {

      tipHelp.setBookmark(values)
        .then(data => res.json(data))
        .catch(err => res.json({ success: false, error: err }));
    } else {
      return res.json({ message: 'This tip is already bookmarked!'});
    }
  });

  /*
  * POST req to add a new like boolean value to the given :tip_id
  * user_id will come from login/cookie mechanism, not hardcoded, once implemented
  */
  router.post("/:tip_id/like", (req, res) => {

    const { value, is_liked } = req.body;
    const tipId =  req.params.tip_id;
    // const userID = req.session.user_id
    let values;

    if (value === "0") {

      values = [userID, tipId];

      tipHelp.unsetLike(values)
        .then(data => res.json(data))
        .catch(err => res.json({ success: false, error: err }));

    } else if (is_liked) {

      values = [userID, req.params.tip_id, value];

      tipHelp.flipLike(values)
        .then(data => res.json(data))
        .catch(err => res.json({ success: false, error: err }));

    } else {

      values = [userID, req.params.tip_id, value];

      tipHelp.setLike(values)
        .then(data => res.json(data))
        .catch(err => res.json({ success: false, error: err }));
    }
  });

  /*
  * POST req to add a new comment associated with the given :tip_id
  * user_id will come from login/cookie mechanism, not body, once implemented
  */
  router.post('/:tip_id/comment', (req, res) => {

    const values = [userID, req.params.tip_id, req.body.comment];

    tipHelp.addComment(values)
      .then(data => res.json(data))
      .catch(err => res.json({ success: false, error: err }));
  });

  /*
  * (should be DELETE req) POST req to delete a comment with the selected id
  * must add user authentication !!!
  */
  router.post('/:tip_id/comment/:id/delete', (req, res) => {

    const values = [req.params.id];

    tipHelp.deleteComment(values)
      .then(data => res.redirect('/'))
      .catch(err => res.json({ success: false, error: err }));
  });



  /*
  * (should be PUT req) POST req to edit an existing comment, user can only edit the 'text' of the comment.
  * must add user authentication !!!
  */
  router.post('/:tip_id/comment/:id', (req, res) => {

    const values = [req.body.comment, req.params.id];

    tipHelp.editComment(values)
      .then(data => res.json(data))
      .catch(err => res.json({ success: false, error: err }));
  });



  /*
  * (should be PUT req) POST request to edit an existing tip, user can only edit title and description
  * must add user authentication !!!
  */
  router.post("/:tip_id", (req, res) => {
    const values = [req.body.title, req.body.description, req.params.tip_id];

    tipHelp.editTip(values)
      .then(data => res.json(data))
      .catch(err => res.json({ success: false, error: err.message }));
  });

  return router;
};
