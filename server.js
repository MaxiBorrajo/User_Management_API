//imports
require("dotenv").config();
const EXPRESS = require("express");
const APP = express();
const PASSPORT = require("passport");
const MORGAN = require("morgan");
const SESSION = require("express-session");
const COOKIE_PARSER = require("cookie-parser");
const CORS = require("cors");

//variables
const CORS_OPTIONS = {
  origin: "http://localhost:5173",
  credentials: true,
};

//dependencies
APP.use(CORS(CORS_OPTIONS));
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: false }));
APP.use(MORGAN("dev"));
APP.use(
    SESSION({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
APP.use(COOKIE_PARSER());
APP.use(PASSPORT.initialize());
APP.use(PASSPORT.session());

//routes

//exports
export default {
    APP
}