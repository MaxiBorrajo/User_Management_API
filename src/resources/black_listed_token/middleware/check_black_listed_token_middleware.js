const BLACK_LISTED_TOKEN = require("../black_listed_token");
const CustomError = require("../../../global_utils/custom_error");
const { is_request_authorized } = require("../../auth/utils/auth_functions");

/**
 * Middleware that checks if the user has the required roles to access a specific route.
 *
 * @param {String} user_id - User's unique identifier.
 * @param {String} token - Json Web Token
 * @param@returns {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the Json Web Token it was already used by the user.
 */
async function is_token_repeated(user_id, token, next) {
  const BLACK_LISTED_TOKEN_FOUND = await BLACK_LISTED_TOKEN.findOne({
    user_id: user_id,
    token: token,
  });
  if (BLACK_LISTED_TOKEN_FOUND) {
    return next(new CustomError("Invalid token", 401));
  }
  return next();
}

/**
 * Middleware function that checks if the actual Json Web Token
 * has been used.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the user is not authorized or if the
 * Json Web Token it was already used by the user.
 */
async function check_black_listed_tokens_middleware(req, res, next) {
  if (!is_request_authorized(req)) {
    return next(new CustomError("Invalid authorization", 401));
  }
  const TOKEN = req.cookies.jwt;
  const USER_ID = req.user._id;
  is_token_repeated(USER_ID, TOKEN, next);
}

module.exports = check_black_listed_tokens_middleware;
