//imports
const EXPRESS = require("express");
const ROUTER = EXPRESS.Router();
const IS_AUTH_MIDDLEWARE = require("../../auth/middleware/is_authorized_middleware");
const CHECK_BLACK_LISTED_MIDDLEWARE = require("../../black_listed_token/middleware/check_black_listed_token_middleware");
const HAS_ROLES_TO_ACCESS_MIDDLEWARE = require("../middleware/has_roles_to_access_middleware");
const VALIDATION_FIELDS_MIDDLEWARE = require("../../../global_middlewares/validate_fields_middleware");
const USER_CONTROLLER = require('../controller/user_controller')
const CACHE = require('../../../../route_cache');
//routes

/**
 * Get all the users that match the filters given by the queries, if there is any filter,
 * else, it gets all users stored in database.
 *
 * @route {GET} /v1/users/
 * Requires authentication, checks for black listed tokens, and requires certain roles.
 * Role USER can access to certain information of the users, ADMIN can access to all,
 * but no one can filter by password. In the queries, between () is specified.
 * @query {String} email (ADMIN)
 * @query {String[]} role (ADMIN, USER)
 * @query {String} name (ADMIN, USER)
 * @query {String} last_name (ADMIN, USER)
 * @query {String} phone_number (ADMIN)
 * @query {String} country (ADMIN, USER)
 * @query {Object} address (ADMIN) Object with attributes:
 * - street: String
 * - city: String
 * - state: String
 * - zip_code: String
 * @query {Number} age (ADMIN, USER) - It must be an integer
 * @query {String} gender (ADMIN, USER)
 * @query {Boolean} is_verified (ADMIN, USER)
 * @query {Boolean} is_active (ADMIN, USER)
 * @query {Boolean} is_public (ADMIN)
 * @query {String[]} studies (ADMIN, USER)
 * @query {String[]} professions (ADMIN, USER)
 * @query {String[]} interests (ADMIN, USER)
 * @throws {CustomError} - If a querie is used by someone that doesn't have the requiere roles.
 */
ROUTER.get(
  "/",
  IS_AUTH_MIDDLEWARE,
  CHECK_BLACK_LISTED_MIDDLEWARE,
  HAS_ROLES_TO_ACCESS_MIDDLEWARE(["USER", "ADMIN"]),
  CACHE(300),
  USER_CONTROLLER.get_all_users
);

/**
 * Get a user by his id.
 *
 * @route {GET} /v1/users/:id or active
 * Requires authentication, checks for black listed tokens, and requires certain roles.
 * Role ADMIN can access to all the information of a user,
 * Role USER only to certain information, specifically:
 * - role
 * - name
 * - last_name
 * - country
 * - age
 * - gender
 * - is_verified
 * - is_active
 * - studies
 * - professions
 * - interests
 *
 * Alternatively, instead of the id of a user, if 'active' is written, the information
 * of the logged user will be send and in its entirety.
 *
 * Also, users who do not have public accounts will not be seen, but they will be seen by users with role ADMIN.
 *
 * @throws {CustomError} - If a given id isn't found in database.
 */
ROUTER.get(
  "/:id",
  IS_AUTH_MIDDLEWARE,
  CHECK_BLACK_LISTED_MIDDLEWARE,
  HAS_ROLES_TO_ACCESS_MIDDLEWARE(["USER", "ADMIN"]),
  CACHE(300),
  USER_CONTROLLER.get_user_by_id
);

/**
 * Creates a new user
 *
 * @route {POST} /v1/users/
 * @body {String} email - Is required and must be a valid email.
 * @body {String} password - Is required and must have
 * at least one lowercase letter, one uppercase letter,
 * one digit, one special character, and 8 characters or longer.
 * @throws {CustomError} - If attributes of the body don't match the requirements specified before,
 * if the email is already taken or if role, is_verified and is_active attributes are in the body, because they
 * cannot be set in creation of a user.
 */
ROUTER.post(
  "/",
  VALIDATION_FIELDS_MIDDLEWARE.meets_with_email_requirements,
  VALIDATION_FIELDS_MIDDLEWARE.meets_with_password_requirements,
  VALIDATION_FIELDS_MIDDLEWARE.body_must_not_contain_attributes([
    "role",
    "is_verified",
    "is_active",
  ]),
  USER_CONTROLLER.creates_a_new_user
);

/**
 * Update a user's information by his id.
 *
 * @route {PUT} /v1/users/:id or active
 * Requires authentication, checks for black listed tokens, and requires certain roles.
 * Only users with role ADMIN can change others user's information. Role USER can only change their
 * information, but not all of them, by writing their id or 'active' as a parameter
 * of the route. And no one can change a password or is_verified attributes by this route.
 *
 * Between ( ) specifies which attributes can be used by which roles.
 * @body {String} email (ADMIN)
 * @body {Enum('ADMIN', 'USER')} role (ADMIN)
 * @body {String} name (ADMIN, USER)
 * @body {String} last_name (ADMIN, USER)
 * @body {String} phone_number (ADMIN, USER)
 * @body {String} profile_photo (ADMIN, USER)
 * @body {String} country (ADMIN, USER)
 * @body {Object} address (ADMIN, USER) Object with attributes:
 * - street: String
 * - city: String
 * - state: String
 * - zip_code: String
 * @body {Number} age (ADMIN, USER) - It must be an integer
 * @body {Enum('Male', 'Female', 'Other')} gender (ADMIN, USER)
 * @body {Boolean} is_public (ADMIN, USER)
 * @body {String[]} studies (ADMIN, USER)
 * @body {String[]} professions (ADMIN, USER)
 * @body {String[]} interests (ADMIN, USER)
 * @throws {CustomError} - If someone tries to change password, is_verified or is_active
 * attributes, if a user tries to change other's information or not allowed attributes, or
 * if an id isn't found in database.
 */
ROUTER.put(
  "/:id",
  VALIDATION_FIELDS_MIDDLEWARE.body_must_not_contain_attributes([
    "password",
    "is_active",
    "is_verified",
  ]),
  IS_AUTH_MIDDLEWARE,
  CHECK_BLACK_LISTED_MIDDLEWARE,
  HAS_ROLES_TO_ACCESS_MIDDLEWARE(["USER", "ADMIN"]),
  USER_CONTROLLER.update_user_by_id
);

/**
 * Delete a user by its id.
 *
 * @route {DELETE} /v1/users/:id or active
 * Requires authentication, checks for black listed tokens, and requires certain roles.
 * Role ADMIN can delete any user, role USER only themselves by writing 'active' as a parameter of
 * the route
 *
 * @throws {CustomError} - If a given id isn't found in database or if a user try to delete
 * other user's account
 */
ROUTER.delete(
  "/:id",
  IS_AUTH_MIDDLEWARE,
  CHECK_BLACK_LISTED_MIDDLEWARE,
  HAS_ROLES_TO_ACCESS_MIDDLEWARE(["USER", "ADMIN"]),
  USER_CONTROLLER.delete_user_by_id
);


//exports
module.exports = ROUTER;
