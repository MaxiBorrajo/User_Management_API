const CustomError = require("../utils/customError");

/**
 * Middleware that checks if the user has the required roles to access a specific route.
 *
 * @param {string[]} roles - An array of strings representing the roles allowed to access the route.
 * @returns {Function} The middleware function that checks the user's roles.
 * @throws {CustomError} If the user is not authorized.
 */
module.exports = (roles) => {
  /**
   * Middleware function that checks if the user has the roles to access.
   *
   * @param {Object} req - The request object from the HTTP request.
   * @param {Object} res - The response object from the HTTP response.
   * @param@returns {Function} next - The next function in the middleware chain.
   * @throws {CustomError} If the user has not the roles specified.
   */
  async function has_roles_to_access_middleware(req, res, next) {
    if (!roles.includes(req.user.role)) {
      return next(new CustomError("You don't have the roles to access", 403));
    }
    return next();
  }

  return has_roles_to_access_middleware;
};
