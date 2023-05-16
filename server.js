//imports
require("dotenv").config();
const EXPRESS = require("express");
const APP = EXPRESS();
const MORGAN = require("morgan");
const COOKIE_PARSER = require("cookie-parser");
const CORS = require("cors");

//dependencies
APP.use(CORS());
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: false }));
APP.use(MORGAN("dev"));
APP.use(COOKIE_PARSER());

//routes

//exports
module.exports = APP;
