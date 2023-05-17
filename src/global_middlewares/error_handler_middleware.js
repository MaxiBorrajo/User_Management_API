/**
 * Middleware that handles errors from a http request.
 * @param {Error} err - The error that has occurred.
 * @param {Object} req - Request's object from the http request
 * @param {Object} res - Response's object from the http response
 * @param {Function} next - Express's next function.
 * @returns {Object} JSON response object with an error message and a status.
 */
function error_handler_middleware(err, req, res, next) {
  const ERROR_MESSAGE_RESPONSE = {
    success: false,
    message: err.message || "Unknown error",
  };
  return res.status(err.status || 500).json(ERROR_MESSAGE_RESPONSE)
}

module.exports = error_handler_middleware
