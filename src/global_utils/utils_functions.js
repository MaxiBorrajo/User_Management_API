const SEND_EMAIL = require("./send_email");
const JWT = require("jsonwebtoken");
const UUID = require("uuid");

/**
 * Function that sees if first_parameter is equal to second_parameter.
 * @param {any} first_parameter - The first parameter to evaluate.
 * @param {any} second_parameter - The second parameter to evaluate.
 * @returns {boolean} True if parameters are equal, false otherwise.
 */
function are_equal(first_parameter, second_parameter) {
  return first_parameter === second_parameter;
}

/**
 * Function that sees if first_parameter is greater to second_parameter.
 * @param {number} first_parameter - The first parameter to evaluate.
 * @param {number} second_parameter - The second parameter to evaluate.
 * @returns {boolean} True if first_parameter is greater to second_parameter, false otherwise.
 */
function is_greater_than(first_parameter, second_parameter) {
  return first_parameter > second_parameter;
}

/**
 * Function that sees if first_parameter is lesser to second_parameter.
 * @param {number} first_parameter - The first parameter to evaluate.
 * @param {number} second_parameter - The second parameter to evaluate.
 * @returns {boolean} True if first_parameter is lesser to second_parameter, false otherwise.
 */
function is_lesser_than(first_parameter, second_parameter) {
  return first_parameter < second_parameter;
}

/**
 * Function that sees if first_parameter is greater or equal to second_parameter.
 * @param {number} first_parameter - The first parameter to evaluate.
 * @param {number} second_parameter - The second parameter to evaluate.
 * @returns {boolean} True if first_parameter is greater or equal to second_parameter, false otherwise.
 */
function is_greater_or_equal_than(first_parameter, second_parameter) {
  return first_parameter >= second_parameter;
}

/**
 * Function that sees if first_parameter is lesser or equal to second_parameter.
 * @param {number} first_parameter - The first parameter to evaluate.
 * @param {number} second_parameter - The second parameter to evaluate.
 * @returns {boolean} True if first_parameter is lesser or equal to second_parameter, false otherwise.
 */
function is_lesser_or_equal_than(first_parameter, second_parameter) {
  return first_parameter <= second_parameter;
}

/**
 * Function that deletes an specific element from an array.
 * @param {any} element - The element to delete from the array
 * @param {Array} array - The array in which delete the element.
 * @returns {Array} If element is in the array, returns array without element,
 * if not, returns array without changes.
 */

function delete_element_from_array(element, array) {
  const INDEX = array.indexOf(element);
  if (INDEX !== -1) {
    array.splice(INDEX, 1);
  }
  return array;
}

/**
 * Function that return a success response with a status, resource and links given.
 * @param {Object} res - The response object from the HTTP response.
 * @param {number} status - The status of the HTTP response. Must be an integer.
 * @param {any} resource - The resource to send to the cliente.
 * @param {Object} links - The links to other route to guide the client.
 * @returns {Object} The response object from the HTTP response
 */
function return_success_response(res, status, resource, links) {
  return res
    .status(status)
    .json({ success: true, resource: resource, _links: links });
}

/**
 * Sends a verification email to a user.
 * @param {Object} user - User object with email and role.
 * @param {Object} auth - Authentication/authorization object for the user.
 * @throws {CustomError} - If the sending fail
 */
async function send_verification(user, auth) {
  const VERIFICATION_CODE = UUID.v4();
  const VERIFICATION_EXPIRATION = Date.now() + 10 * (60 * 1000);
  const TOKEN = JWT.sign(
    {
      email: user.email,
      verification_code: VERIFICATION_CODE,
    },
    process.env.JWT_SECRET
  );
  const VERIFICATION_URL = `http://localhost:3000/v1/auth/verification/${TOKEN}`;
  //esto despues va a ser un archivo html lindo
  const EMAIL_BODY = `
      <h1>Confirm verification</h1>
      <p>To confirm your account, click in the following link: </p>
      <a href='${VERIFICATION_URL}' clicktracking='off'>Verify Account</a>
    `;

  
  try {
    SEND_EMAIL({
      to: user.email,
      subject: "Verify your account",
      text: EMAIL_BODY,
    });
  
    auth.verification_code = VERIFICATION_CODE;
    auth.verification_expire = VERIFICATION_EXPIRATION;
    await auth.save();
  } catch (error) {
    auth.verification_code = undefined;
    auth.verification_expire = undefined;

    await auth.save();
    return next(new CustomError(error.message, 500));
  }
}

module.exports = {
  are_equal,
  is_greater_than,
  is_lesser_than,
  is_greater_or_equal_than,
  is_lesser_or_equal_than,
  delete_element_from_array,
  return_success_response,
  send_verification,
};
