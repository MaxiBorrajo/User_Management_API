//imports
const MONGOOSE = require("mongoose");
const CRYPTO_JS = require("crypto-js");
const { is_greater_than } = require("../../global_utils/utils_functions");
const JWT = require("jsonwebtoken");
const CustomError = require("../../global_utils/custom_error");
//schema
const AUTH_SCHEMA = new MONGOOSE.Schema(
  {
    reset_password_token: String,
    reset_password_expire: Date,
    verification_code: String,
    verification_expire: Date,
    user_id: { type: MONGOOSE.Schema.Types.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Schema's method that generates a reset password token.
 * @param {String} user_id - Id of a user store in database
 * @param {String} new_password - The new password to add
 * @returns {String} A token that is used to allow the user change his password.
 */
AUTH_SCHEMA.methods.get_reset_password_token = async function (
  user_id,
  new_password
) {
  try {
    const ENCRYPTED_PASSWORD = await CRYPTO_JS.AES.encrypt(
      new_password,
      process.env.SECRET
    ).toString();

    const PAYLOAD = {
      user_id: user_id,
      encrypted_password: ENCRYPTED_PASSWORD,
    };

    const TOKEN = await JWT.sign(PAYLOAD, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    this.reset_password_token = TOKEN;
    this.reset_password_expire = Date.now() + 3600000; // 1 hora de expiración

    return TOKEN;
  } catch (error) {
    throw new CustomError(error.message, 500);
  }
};

/**
 * Schema's method that checks if the verification token hasn't expired.
 * @returns {Boolean} True is the token has expires, false otherwise.
 */
AUTH_SCHEMA.methods.is_verification_token_expired = function () {
  return is_greater_than(Date.now(), this.verification_expire);
};

const AUTH = new MONGOOSE.model("auth", AUTH_SCHEMA);

module.exports = AUTH;
