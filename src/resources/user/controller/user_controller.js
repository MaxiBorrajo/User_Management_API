const USER = require("../user");
const AUTH = require("../../auth/auth");
const BLACK_LISTED_TOKEN = require("../../black_listed_token/black_listed_token");
const CustomError = require("../../../global_utils/custom_error");
const {
  return_response,
  send_verification,
} = require("../../../global_utils/utils_functions");
const SEND_EMAIL = require("../../../global_utils/send_email");
const USER_LINKS = require("../utils/response_links");
const AUTH_LINKS = require("../../auth/utils/response_links");

/**
 * Controller that gets all the users that match the filters given by the queries,
 * if there is any filter, else, it gets all users stored in database.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the user tries to filter by password, if a role USER tries to filter
 * by something he isn't allowed or if no user is founded that match the given filters.
 */
async function get_all_users(req, res, next) {
  try {
    if (req.query.password) {
      return next(new CustomError(`You can't filter by password`, 400));
    }

    const QUERY_ATTRIBUTES = Object.keys(req.query);

    const ATTRIBUTES_TO_EXCLUDE_FOR_USER = [
      "email",
      "phone_number",
      "is_public",
      "address.street",
      "address.city",
      "address.zip_code",
      "address.state",
    ];

    const FOUND_ATTRIBUTE = QUERY_ATTRIBUTES.find((attribute) =>
      ATTRIBUTES_TO_EXCLUDE_FOR_USER.includes(attribute)
    );

    if (req.user.role === "USER" && FOUND_ATTRIBUTE) {
      return next(
        new CustomError(
          `The query '${FOUND_ATTRIBUTE}' is not allowed for role: USER`,
          400
        )
      );
    }

    let USERS_FOUND;

    if (req.user.role === "USER") {
      USERS_FOUND = await USER.find({
        $and: [req.query, { is_public: true }],
      });
    } else {
      USERS_FOUND = await USER.find(req.query).select("+address +email");
    }

    if (USERS_FOUND.length <= 0) {
      return next(
        new CustomError(`No users were found that match the given filters`, 404)
      );
    }

    const LINKS = {
      self: USER_LINKS.GET_ALL_USERS,
      user: USER_LINKS.GET_USER_BY_ID,
      active: USER_LINKS.GET_ACTIVE_USER,
    };

    return return_response(res, 200, USERS_FOUND, LINKS, true);
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller that get a user by his id.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the user isn't founded
 */
async function get_user_by_id(req, res, next) {
  try {
    const ID_USER = req.params.id === "active" ? req.user.id : req.params.id;
    const LINKS = {
      self: USER_LINKS.GET_USER_BY_ID,
      user: USER_LINKS.GET_ALL_USERS,
      create: USER_LINKS.POST_NEW_USER,
      delete: USER_LINKS.DELETE_USER_BY_ID,
    };

    const USER_FOUND = await USER.findOne({ _id: ID_USER }).select(
      "+address +email"
    );

    if (!USER_FOUND) {
      return next(new CustomError(`User not found`, 404));
    }

    if (
      ID_USER === "active" ||
      ID_USER === req.user.id ||
      req.user.role === "ADMIN"
    ) {
      return return_response(res, 200, USER_FOUND, LINKS, true);
    }

    if (!USER_FOUND.is_public) {
      return next(new CustomError(`The user searched is private`, 404));
    }

    const USER_FOUND_BY_ID_AND_USER = {
      _id: USER_FOUND._id,
      role: USER_FOUND.role,
      name: USER_FOUND.name,
      last_name: USER_FOUND.last_name,
      country: USER_FOUND.country,
      age: USER_FOUND.age,
      gender: USER_FOUND.gender,
      is_verified: USER_FOUND.is_verified,
      is_active: USER_FOUND.is_active,
      studies: USER_FOUND.studies,
      professions: USER_FOUND.professions,
      interests: USER_FOUND.interests,
    };

    return return_response(res, 200, USER_FOUND_BY_ID_AND_USER, LINKS, true);
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller that creates a new user.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the email already exists in database
 */
async function creates_a_new_user(req, res, next) {
  try {
    const USER_FOUND = await USER.findOne({ email: req.body.email });
    if (USER_FOUND) {
      return next(new CustomError("User already exists", 400));
    }
    const NEW_USER = await new USER(req.body).save();
    const NEW_AUTH = await new AUTH({ user_id: NEW_USER._id }).save();
    send_verification(NEW_USER, NEW_AUTH);

    const LINKS = {
      self: USER_LINKS.POST_NEW_USER,
      sign_in: AUTH_LINKS.SIGN_IN,
      forgot_password: AUTH_LINKS.FORGOT_PASSWORD,
      change_email: AUTH_LINKS.CHANGE_EMAIL,
      delete: USER_LINKS.DELETE_USER_BY_ID,
    };

    const RESOURCE = {
      message:
        "User created succesfully. Go to your email account and get verified to access to all the resources",
      user: NEW_USER,
    };

    return return_response(res, 201, RESOURCE, LINKS, true);
  } catch (error) {
    return next(error);
  }
}

/**
 * Updates a user by his ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If a USER role tries to change a disallowed attribute,
 * tries to change others information, or if the specified ID is not found in the database.
 */
async function update_user_by_id(req, res, next) {
  try {
    const BODY_ATTRIBUTES = Object.keys(req.body);
    const ATTRIBUTES_TO_EXCLUDE_FOR_USER = ["email", "role"];
    const FOUND_ATTRIBUTE = BODY_ATTRIBUTES.find((attribute) =>
      ATTRIBUTES_TO_EXCLUDE_FOR_USER.includes(attribute)
    );

    if (req.user.role === "USER" && FOUND_ATTRIBUTE) {
      return next(
        new CustomError(
          `The attribute '${FOUND_ATTRIBUTE}' is not allowed to change for USER role.`,
          400
        )
      );
    }

    const ID_USER =
      req.params.id === "active" ? req.user.id.toString() : req.params.id;

    if (req.user.role === "USER" && ID_USER !== req.user.id.toString()) {
      return next(
        new CustomError(
          `USER role is not allowed to change others information.`,
          400
        )
      );
    }

    if (req.body.email) {
      const REGULAR_EXPRESSION_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!REGULAR_EXPRESSION_EMAIL.test(req.body.email)) {
        return next(
          new CustomError(
            "The value of the 'email' attribute must be a valid email address",
            422
          )
        );
      }
      const USER_FOUND = await USER.findOne({ email: req.body.email });
      if (USER_FOUND) {
        return next(new CustomError("User already exists", 400));
      }
    }

    const USER_UPDATED = await USER.updateOne({ _id: ID_USER }, req.body);

    if (USER_UPDATED.matchedCount <= 0) {
      return next(new CustomError(`User not found.`, 404));
    }

    if (USER_UPDATED.modifiedCount <= 0) {
      return next(new CustomError(`User not modified.`, 500));
    }

    const LINKS = {
      self: USER_LINKS.PUT_USER_BY_ID,
      user: USER_LINKS.GET_USER_BY_ID,
      forgot_password: AUTH_LINKS.FORGOT_PASSWORD,
      change_email: AUTH_LINKS.CHANGE_EMAIL,
    };

    const RESOURCE = {
      message: "User updated successfully.",
    };

    return return_response(res, 201, RESOURCE, LINKS, true);
  } catch (error) {
    return next(error);
  }
}

/**
 * Deletes a user by his ID.
 *
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If a USER role tries to delete others accounts,
 * or if the specified ID is not found in the database.
 */
async function delete_user_by_id(req, res, next) {
  try {
    const ID_USER =
      req.params.id === "active" ? req.user.id.toString() : req.params.id;
    if (req.user.role === "USER" && ID_USER !== req.user.id.toString()) {
      return next(
        new CustomError(
          `USER role is not allowed to delete others accounts.`,
          400
        )
      );
    }

    const USER_DELETED = await USER.deleteOne({ _id: ID_USER });

    if (USER_DELETED.deletedCount <= 0) {
      return next(new CustomError(`User not found.`, 404));
    }

    AUTH.deleteOne({ user_id: ID_USER });

    BLACK_LISTED_TOKEN.deleteMany({ user_id: ID_USER });

    const LINKS = {
      self: USER_LINKS.DELETE_USER_BY_ID,
      user: USER_LINKS.GET_USER_BY_ID,
      create: USER_LINKS.POST_NEW_USER,
    };

    const RESOURCE = {
      message: "User deleted successfully.",
    };

    return return_response(res, 200, RESOURCE, LINKS, true);
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller to send feeback to me :)
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the email sender fails
 */
async function send_feedback(req, res, next) {
  try {
    const EMAIL_BODY = `
        <h1>Feedback sent from:</h1>
        <p>Email: ${req.body.email}</p>
        <p>Name: ${req.body.name}</p>
        <p>Comment: ${req.body.text}</p>
      `;
    SEND_EMAIL({
      to: process.env.EMAIL_FROM,
      subject: `Feedback about the user management api from ${req.body.name}`,
      text: EMAIL_BODY,
    });

    const LINKS = {
      self: USER_LINKS.SEND_FEEDBACK,
      sign_in: AUTH_LINKS.SIGN_IN,
      create: USER_LINKS.POST_NEW_USER,
    };

    const RESOURCE = {
      message: "Feedback sent succesfully. Thank you for taking the time",
    };
    return return_response(res, 200, RESOURCE, LINKS, true);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  get_all_users,
  get_user_by_id,
  creates_a_new_user,
  update_user_by_id,
  delete_user_by_id,
  send_feedback,
};
