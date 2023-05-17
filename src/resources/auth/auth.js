//imports
const MONGOOSE = require("mongoose");
const CRYPTO = require("crypto");
const { is_greater_than } = require("../../global_utils/utils_functions");
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
 * @returns {String} Token a is used to allow the user change his password.
 */
AUTH_SCHEMA.methods.get_reset_password_token = function () {
  const TOKEN = CRYPTO.randomBytes(20).toLocaleString("hex");
  this.reset_password_token = CRYPTO
    .createHash("sha256")
    .update(TOKEN)
    .digest("hex");
  this.reset_password_expire = Date.now() + 10 * (60 * 1000);
  return TOKEN;
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
