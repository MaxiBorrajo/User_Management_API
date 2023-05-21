//imports
const EXPRESS = require("express");
const ROUTER = EXPRESS.Router();
const IS_AUTH_MIDDLEWARE = require("../../auth/middleware/is_authorized_middleware");
const CHECK_BLACK_LISTED_MIDDLEWARE = require("../../black_listed_token/middleware/check_black_listed_token_middleware");
const HAS_ROLES_TO_ACCESS_MIDDLEWARE = require("../../user/middleware/has_roles_to_access_middleware");
const VALIDATION_FIELDS_MIDDLEWARE = require("../../../global_middlewares/validate_fields_middleware");

//routes

/**
 * Post an email and password to sign in and get access to other endpoints.
 *
 * @route {POST} /v1/auth/
 * @body {String} email - Is required and must be a valid email.
 * @body {String} password - Is required and must have
 * at least one lowercase letter, one uppercase letter,
 * one digit, one special character, and be 8 characters or longer.
 *
 * Other attributes written in the body will be just ignored.
 *
 * @throws {CustomError} - If attributes of the body don't match the requirements specified before,
 * if the email isn't found in database, if the password doesn't match with the one store in
 * database, or if the user isn't verified yet.
 */
ROUTER.post(
  "/",
  VALIDATION_FIELDS_MIDDLEWARE.meets_with_email_requirements,
  VALIDATION_FIELDS_MIDDLEWARE.meets_with_password_requirements,
  (req, res, next) => {
    console.log("GOAL");
  }
);

/**
 * Post an email to send a link to verify the associated account.
 *
 * @route {POST} /v1/auth/verification
 * @body {String} email - Is required and must be a valid email.
 *
 * Other attributes written in the body will be just ignored.
 *
 * @throws {CustomError} - If attributes of the body don't match the requirements specified before,
 * if the email isn't found in database, or if the account is already verified.
 */
ROUTER.post(
  "/verification",
  VALIDATION_FIELDS_MIDDLEWARE.meets_with_email_requirements,
  (req, res, next) => {
    console.log("GOAL");
  }
);

/**
 * The account encrypted in the token gets verification
 *
 * @route {GET} /v1/auth/verification/:token
 *
 * @throws {CustomError} - If the token is invalid, if the user encryted in the token
 * isn't found in database, if user is already verified, if the token is not the same as
 * the one stored in database or if the token is expired.
 */
ROUTER.get("/verification/:token", (req, res, next) => {
  console.log("GOAL");
});

/**
 * Post an email to send a link to change the password of the associated account.
 *
 * @route {POST} /v1/auth/new_password
 * @body {String} email - Is required and must be a valid email.
 *
 * Other attributes written in the body will be just ignored.
 *
 * @throws {CustomError} - If attributes of the body don't match the requirements specified before or
 * if the email isn't found in database.
 */
ROUTER.post(
  "/new_password",
  VALIDATION_FIELDS_MIDDLEWARE.meets_with_email_requirements,
  (req, res, next) => {
    console.log("GOAL");
  }
);

/**
 * Update the associated account with the new password submitted.
 *
 * @route {PATCH} /v1/auth/new_password/:reset_token
 * @body {String} password - Is required and must have
 * at least one lowercase letter, one uppercase letter,
 * one digit, one special character, and be 8 characters or longer.
 *
 * Other attributes written in the body will be just ignored.
 *
 * @throws {CustomError} - If attributes of the body don't match the requirements specified before,
 * if the token is not same as the one stored in database or if the token is expired.
 */
ROUTER.patch(
  "/new_password/:reset_token",
  VALIDATION_FIELDS_MIDDLEWARE.meets_with_password_requirements,
  (req, res, next) => {
    console.log("GOAL");
  }
);

/**
 * Delete the authorization of the active account. Basically, is a sign out endpoint.
 *
 * @route {DELETE} /v1/auth/
 * Requires authentication, checks for black listed tokens, and requires certain roles.
 */
ROUTER.delete(
  "/",
  IS_AUTH_MIDDLEWARE,
  CHECK_BLACK_LISTED_MIDDLEWARE,
  HAS_ROLES_TO_ACCESS_MIDDLEWARE(["USER", "ADMIN"]),
  (req, res, next) => {
    console.log("GOAL");
  }
);

/**
 * Post an email to send a link to verify it.
 *
 * @route {POST} /v1/auth/new_email
 * @body {String} email - Is required and must be a valid email.
 *
 * Other attributes written in the body will be just ignored.
 *
 * @throws {CustomError} - If attributes of the body don't match the requirements specified before,
 * if the email is already taken, or if it's the same of the one stored in database.
 */
ROUTER.post(
  "/new_email",
  VALIDATION_FIELDS_MIDDLEWARE.meets_with_email_requirements,
  IS_AUTH_MIDDLEWARE,
  CHECK_BLACK_LISTED_MIDDLEWARE,
  HAS_ROLES_TO_ACCESS_MIDDLEWARE(["USER", "ADMIN"]),
  (req, res, next) => {
    console.log("GOAL");
  }
);

/**
 * The new email encrypted in the token is stored in database and gets verification
 *
 * @route {PATCH} /v1/auth/new_email/:token
 *
 * @throws {CustomError} - If the token is invalid, if the user encryted in the token
 * isn't found in database, if the token is not the same as the one stored in database or
 * if the token is expired.
 */
ROUTER.patch("/new_email/:token", (req, res, next) => {
  console.log("GOAL");
});

//exports
module.exports = ROUTER;
