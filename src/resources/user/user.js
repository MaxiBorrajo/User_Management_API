//imports
const MONGOOSE = require("mongoose");
const BCRYPT = require("bcrypt");
const JWT = require("jsonwebtoken");
const CustomError = require("../../global_utils/custom_error");
//schema
const USER_SCHEMA = new MONGOOSE.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      required: true,
      default: "USER",
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    name: String,
    last_name: String,
    profile_photo: String,
    phone_number: String,
    country: String,
    address: {
      type: { street: String, city: String, state: String, zip_code: String },
      select: false,
    },
    age: {
      type: Number,
      integer: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    is_verified: {
      type: Boolean,
      required: true,
      default: false,
    },
    is_active: {
      type: Boolean,
      default: false,
    },
    is_public: {
      type: Boolean,
      default: false,
    },
    studies: {
      type: [String],
      default: [],
    },
    professions: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Middleware that encrypts the user's password before saving it to the database.
 * @param {Function} next - Express's next function.
 * @returns {Promise<void>} Promise that is resolved when process of encryption is completed.
 */
USER_SCHEMA.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  } else {
    const SALT = await BCRYPT.genSalt(10);
    this.password = await BCRYPT.hash(this.password, SALT);
    next();
  }
});

/**
 * Function that verifies if passwords matches.
 * @param {String} password - Password to see if matches with the one store in the database.
 * @returns {Promise<Boolean>} Promise that returns a boolean when the process of matching finish.
 */
USER_SCHEMA.methods.match_passwords = async function (password) {
  return await BCRYPT.compare(password, this.password);
};

/**
 * Schema's method that generates a Json Web Token.
 * @returns {String} A Json Web Token generated by user's id, email and role, and a secret.
 */
USER_SCHEMA.methods.generate_token = function () {
  return JWT.sign(
    {
      _id: this._id,
      email: this.email,
      role: this.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
};

const USER = new MONGOOSE.model("user", USER_SCHEMA);

module.exports = USER;
