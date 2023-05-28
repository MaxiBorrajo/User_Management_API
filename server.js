//imports
require("dotenv").config();
const EXPRESS = require("express");
const APP = EXPRESS();
const MORGAN = require("morgan");
const COOKIE_PARSER = require("cookie-parser");
const CORS = require("cors");
const ERROR_HANDLER_MIDDLEWARE = require("./src/global_middlewares/error_handler_middleware");
const USER_ROUTE = require("./src/resources/user/route/user_route");
const AUTH_ROUTE = require("./src/resources/auth/route/auth_route");

//dependencies
APP.use(CORS());
APP.use(EXPRESS.json());
APP.use(EXPRESS.urlencoded({ extended: false }));
APP.use(MORGAN("dev"));
APP.use(COOKIE_PARSER());

//routes
APP.use("/v1/users", USER_ROUTE);
APP.use("/v1/auth", AUTH_ROUTE);

//global middlewares
APP.use(ERROR_HANDLER_MIDDLEWARE);

//exports
module.exports = APP;
