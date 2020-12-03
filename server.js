// load .env data into process.env
require('dotenv').config();

// Web server config
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const bcrypt     = require('bcrypt');
const cookieSession = require('cookie-session');

// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

exports.db = db;

// create cookie cookieSession
app.use(cookieSession({
  name: 'session',
  keys: ['key1']
}));

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// --------------------------------
// Authentication Middleware
// --------------------------------

/**
 * Gets user credentials from session cookie user_id and stores them
 * in res.locals.user which is available is subsequent routes and templates
 */
app.use(function(req, res, next) {
  const userhelper = require('./db/helpers/user-help');
  userhelper.findUserByID(req.session.user_id)
  .then(data => {
    res.locals.user = data || {};
    next();
  })
  .catch(err => {
    next(err);
  });
});

/**
 * Check the user in res.locals.user against a specified user_id and execute callback on failure
 * @param {Number} checkedUserID
 * @param {Function} err_callback
 */
const checkAuth = function(checkedUserID, err_callback) {
  if (req.session.user in users) {
    return next();
  }
  return res.redirect('/login?status=notAuthorized');
};


// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const searchRoutes = require("./routes/search");
const userRoutes = require("./routes/user");
const tipRoutes = require("./routes/tip");
const homeRoutes = require("./routes/home");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/search", searchRoutes(db));
app.use("/user", userRoutes(db));
app.use("/tip", tipRoutes(db));
app.use("/", homeRoutes(db));

// ----- Main Error catching can go here -----

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

// error handler
app.use(function(err, req, res, next) {
  const { message, stack } = err;
  const status = (err.status || 500);
  console.log('ERROR------', err);
  res.status(status);
  return res.render("error", { status, message, stack });
});
