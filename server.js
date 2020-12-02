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
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// --------------------------------
// Custom Middleware
// --------------------------------

app.use(function(req, res, next) {
  const userhelper = require('./db/user-db-helpers');
  res.locals.user = req.session.user_id|| {}; // Empty user object if no user
  next();
});

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const searchRoutes = require("./routes/search");
const userRoutes = require("./routes/user");
const tipRoutes = require("./routes/tip");
const homeRoutes = require("./routes/home");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/search", searchRoutes(db));
app.use("/user", userRoutes());
app.use("/tips", tipRoutes());
app.use("/", homeRoutes(db));

// ----- Main Error catching can go here -----

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
