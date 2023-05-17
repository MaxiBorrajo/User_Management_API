const CustomError = require("../../../global_utils/custom_error");

/**
 * Función that checks if the request is authorized to continue.
 * @param {Object} req - The request object from the HTTP request.
 * @returns {Boolean} True if the request is authorized, false otherwise.
 */
function is_request_authorized(req) {
  return (
    req.cookies.jwt !== undefined &&
    req.headers.authorization &&
    req.cookies.jwt === get_token(req.headers.authorization)
  );
}

/**
 * Function that returns takes the Json Web Token from the authorization header if it exists
 * @param {String} authorization_header - Authorization header from the request
 * @returns {String} The Json Web Token stored in the header
 * @throws {CustomError} If the header is not present or is not correct.
 */
function get_token(authorization_header) {
  if (authorization_header && authorization_header.startsWith("Bearer ")) {
    return authorization_header.replace("Bearer ", "");
  } else {
    throw new CustomError("Invalid authorization", 401);
  }
}

module.exports = {
  is_request_authorized,
  get_token,
};
