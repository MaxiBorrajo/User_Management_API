const USER = require("../../user/user");
const JWT = require("jsonwebtoken");
const CustomError = require("../../../global_utils/custom_error");
const {
  is_request_authorized,
  get_token,
} = require("../utils/auth_functions");

/**
   * Middleware function that authenticate the user from the request
   * and authorize to continue.
   *
   * @param {Object} req - The request object from the HTTP request.
   * @param {Object} res - The response object from the HTTP response.
   * @param@returns {Function} next - The next function in the middleware chain.
   * @throws {CustomError} If the request is not authorized to continue or 
   * if the user is not found
   */
async function is_authenticated_middleware(req, res, next) {
  if (!is_request_authorized(req)) {
    return next(new CustomError("Invalid authorization", 401));
  }
  const PAYLOAD = JWT.verify(
    get_token(req.headers.authorization),
    process.env.JWT_SECRET
  );
  const USER_FOUND = await USER.findOne({ _id: PAYLOAD._id });
  if (!USER_FOUND) {
    return next(new CustomError("Not authorized", 401));
  }
  req.user = {
    id: USER_FOUND._id,
    role: USER_FOUND.role,
  };
  return next();
}

module.exports = is_authenticated_middleware;
