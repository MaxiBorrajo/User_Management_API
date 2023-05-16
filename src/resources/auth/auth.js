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

AUTH_SCHEMA.methods.get_reset_password_token = async function () {
  const token = CRYPTO.randomBytes(20).toLocaleString("hex");
  this.reset_password_token = CRYPTO
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.reset_password_expire = Date.now() + 10 * (60 * 1000);
  return token;
};

AUTH_SCHEMA.methods.is_verification_token_expired = function () {
  return is_greater_than(Date.now(), this.verification_expire);
};

const AUTH = new MONGOOSE.model("auth", AUTH_SCHEMA);

module.exports = AUTH;
