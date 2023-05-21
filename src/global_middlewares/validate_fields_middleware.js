const CustomError = require("../global_utils/custom_error");

/**
 * Middleware function that checks if the body of the request meets certain requirements.
 * Requirements:
 * - The body must have an 'email' attribute.
 * - The 'email' attribute, if present, must be a valid email address.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the body of the request doesn't meet the requirements.
 */
function meets_with_email_requirements(req, res, next) {
  const EMAIL = req.body.email;
  if (!EMAIL) {
    return next(new CustomError("An 'email' attribute is required", 400));
  }

  const REGULAR_EXPRESSION_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!REGULAR_EXPRESSION_EMAIL.test(EMAIL)) {
    return next(
      new CustomError(
        "The value of the 'email' attribute must be a valid email address",
        422
      )
    );
  }

  return next();
}

/**
 * Middleware function that checks if the body of the request meets certain requirements.
 * Requirements:
 * - The body must have an 'password' attribute.
 * - The 'password' attribute, if present, must be have
 * at least one lowercase letter, one uppercase letter,
 * one digit, one special character, and be 8 characters or longer.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the body of the request doesn't meet the requirements.
 */
function meets_with_password_requirements(req, res, next) {
  const PASSWORD = req.body.password;
  if (!PASSWORD) {
    return next(new CustomError("A 'password' attribute is required", 400));
  }
  const REGULAR_EXPRESSION_PASSWORD =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!REGULAR_EXPRESSION_PASSWORD.test(PASSWORD)) {
    return next(
      new CustomError(
        "The value of 'password' attribute must have at least one lowercase letter, one uppercase letter, one digit, one special character, and be 8 characters or longer.",
        422
      )
    );
  }
  return next();
}

/**
 * Creates a middleware function that checks if the body of the request does not contain specified attributes.
 *
 * @param {string[]} attributes_to_exclude - An array of attribute names that should not be present in the request body.
 * @returns {Function} - A middleware function that checks the presence of the specified attributes.
 * @throws {CustomError} - If any of the excluded attributes are found in the request body.
 */
function body_must_not_contain_attributes(attributes_to_exclude) {
  /**
   * Middleware function that checks if the body of the request does not contain specified attributes.
   *
   * @param {Object} req - The request object from the HTTP request.
   * @param {Object} res - The response object from the HTTP response.
   * @param {Function} next - The next function in the middleware chain.
   * @throws {CustomError} - If any of the excluded attributes are found in the request body.
   */
  return function (req, res, next) {
    const BODY_ATTRIBUTES = Object.keys(req.body);
    const FOUND_ATTRIBUTE = BODY_ATTRIBUTES.find((attribute) =>
      attributes_to_exclude.includes(attribute)
    );
    if (FOUND_ATTRIBUTE) {
      return next(
        new CustomError(`The attribute '${FOUND_ATTRIBUTE}' is not allowed`)
      );
    }
    return next();
  };
}

module.exports = {
  meets_with_email_requirements,
  meets_with_password_requirements,
  body_must_not_contain_attributes,
};
