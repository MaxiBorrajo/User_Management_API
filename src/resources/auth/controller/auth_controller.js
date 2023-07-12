const CustomError = require("../../../global_utils/custom_error");
const BLACK_LISTED_TOKEN = require("../../black_listed_token/black_listed_token");
const USER = require("../../user/user");
const AUTH = require("../auth");
const SEND_EMAIL = require("../../../global_utils/send_email");
const {
  return_response,
  send_verification,
  are_equal,
  is_greater_than,
} = require("../../../global_utils/utils_functions");
const JWT = require("jsonwebtoken");
const CRYPTO_JS = require("crypto-js");
const UUID = require("uuid");
const AUTH_LINKS = require("../utils/response_links");
const USER_LINKS = require("../../user/utils/response_links");

/**
 * Controller granting authorization using a Json Web Token
 * to use in HTTP authorization header if email and password sent
 * they are authenticated.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the user isn't found, if the user is not verified
 * or if the user gives an incorrect password
 */
async function sign_in(req, res, next) {
  try {
    const USER_FOUND = await USER.findOne({ email: req.body.email }).select(
      "+password"
    );
    if (!USER_FOUND) {
      return next(new CustomError("User not found", 404));
    }

    if (!USER_FOUND.is_verified) {
      const LINKS = {
        self: AUTH_LINKS.SIGN_IN,
        send_verification: AUTH_LINKS.SEND_VERIFICATION_AGAIN,
      };
      const RESOURCE = {
        message:
          "You must verified your account. To send verification again use to the link below",
      };
      return return_response(res, 404, RESOURCE, LINKS, false);
    }

    if (!(await USER_FOUND.match_passwords(req.body.password))) {
      return next(new CustomError("Invalid credentials", 400));
    }

    const TOKEN = await USER_FOUND.generate_token();

    res.cookie("jwt", TOKEN, {
      maxAge: 86400000,
      httpOnly: true,
    });

    USER_FOUND.is_active = true;

    USER_FOUND.save();

    const LINKS = {
      self: AUTH_LINKS.SIGN_IN,
      sign_out: AUTH_LINKS.SIGN_OUT,
      forgot_password: AUTH_LINKS.FORGOT_PASSWORD,
      change_email: AUTH_LINKS.CHANGE_EMAIL,
      get_all_users: USER_LINKS.GET_ALL_USERS,
      get_active_user: USER_LINKS.GET_ACTIVE_USER,
      delete: USER_LINKS.DELETE_USER_BY_ID,
    };

    const RESOURCE = {
      message: "Sign in succesfully",
      security_token: TOKEN,
    };

    return return_response(res, 200, RESOURCE, LINKS, true);
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller sends a verification email to verify an account
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the user isn't found or if the user is already verified.
 */
async function send_verification_again(req, res, next) {
  try {
    const USER_FOUND = await USER.findOne({ email: req.body.email }).select(
      "+email"
    );

    if (!USER_FOUND) {
      return next(new CustomError("User not found", 404));
    }

    if (USER_FOUND && USER_FOUND.is_verified) {
      return next(new CustomError("You are already verified", 400));
    }
    let AUTH_FOUND = await AUTH.findOne({ user_id: USER_FOUND._id });

    if (!AUTH_FOUND) {
      AUTH_FOUND = await AUTH.create({ user_id: USER_FOUND._id });
    }
    send_verification(USER_FOUND, AUTH_FOUND);

    const LINKS = {
      self: AUTH_LINKS.SEND_VERIFICATION_AGAIN,
      sign_in: AUTH_LINKS.SIGN_IN,
      forgot_password: AUTH_LINKS.FORGOT_PASSWORD,
      change_email: AUTH_LINKS.CHANGE_EMAIL,
      get_all_users: USER_LINKS.GET_ALL_USERS,
      get_active_user: USER_LINKS.GET_ACTIVE_USER,
      delete: USER_LINKS.DELETE_USER_BY_ID,
    };

    const RESOURCE = {
      message: "Verification email sent",
    };
    return return_response(res, 200, RESOURCE, LINKS, true);
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller that verify an account
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the user isn't found, if the user is
 * already verified, if the verification code doesn't match the
 * one store in database, if it has expired or if the token is invalid.
 */
async function verify_account(req, res, next) {
  try {
    const PAYLOAD = JWT.verify(req.params.token, process.env.JWT_SECRET);

    const USER_FOUND = await USER.findOne({ email: PAYLOAD.email });

    if (!USER_FOUND) {
      return next(new CustomError("User not found", 404));
    }

    if (USER_FOUND.is_verified) {
      return next(new CustomError("You are already verified", 400));
    }

    let AUTH_FOUND = await AUTH.findOne({ user_id: USER_FOUND._id });

    if (!AUTH_FOUND) {
      AUTH_FOUND = await AUTH.create({ user_id: USER_FOUND._id });
    }

    if (!are_equal(PAYLOAD.verification_code, AUTH_FOUND.verification_code)) {
      const LINKS = {
        send_verification: AUTH_LINKS.SEND_VERIFICATION_AGAIN,
      };
      const RESOURCE = {
        message: "Verification failed, send verification again",
      };
      return return_response(res, 401, RESOURCE, LINKS, false);
    }

    if (AUTH_FOUND.is_verification_token_expired()) {
      const LINKS = {
        send_verification: AUTH_LINKS.SEND_VERIFICATION_AGAIN,
      };
      const RESOURCE = {
        message: "Verification token expired, send verification again",
      };
      return return_response(res, 401, RESOURCE, LINKS, false);
    }

    USER_FOUND.is_verified = true;
    AUTH_FOUND.verification_code = undefined;
    AUTH_FOUND.verification_expire = undefined;
    await USER_FOUND.save();
    await AUTH_FOUND.save();
    const LINKS = {
      sign_in: AUTH_LINKS.SIGN_IN,
      forgot_password: AUTH_LINKS.FORGOT_PASSWORD,
      change_email: AUTH_LINKS.CHANGE_EMAIL,
    };
    const RESOURCE = {
      message: "Your account have been verified, now go and sign in",
    };
    return return_response(res, 200, RESOURCE, LINKS, true);
  } catch (error) {
    next(error);
  }
}

/**
 * Controller that sends a password change confirmation email
 * to the address provided and updates the password with
 * the new information entered.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the user isn't found in database.
 */
async function forgot_password(req, res, next) {
  try {
    const USER_FOUND = await USER.findOne({ email: req.body.email }).select(
      "+email"
    );

    if (!USER_FOUND) {
      return next(new CustomError("User not found", 404));
    }

    let AUTH_FOUND = await AUTH.findOne({ user_id: USER_FOUND._id });

    if (!AUTH_FOUND) {
      AUTH_FOUND = await AUTH.create({ user_id: USER_FOUND._id });
    }

    const RESET_PASSWORD_TOKEN = await AUTH_FOUND.get_reset_password_token(
      USER_FOUND._id,
      req.body.password
    );

    await AUTH_FOUND.save();
    const RESET_PASSWORD_URL = `https://api-user-management.cyclic.app/v1/auth/new_password/${RESET_PASSWORD_TOKEN}`;
    //esto despues va a ser un archivo html lindo
    const RESET_PASSWORD_EMAIL_BODY = `
        <h1>Reset password</h1>
        <p>To reset your password click the following link: </p>
        <a href='${RESET_PASSWORD_URL}' rel='noreferrer' referrerpolicy='origin' clicktracking='off'>${RESET_PASSWORD_URL}</a>
      `;
    try {
      SEND_EMAIL({
        to: USER_FOUND.email,
        subject: "Password Reset Requested",
        text: RESET_PASSWORD_EMAIL_BODY,
      });

      const LINKS = {
        self: AUTH_LINKS.FORGOT_PASSWORD,
        change_email: AUTH_LINKS.CHANGE_EMAIL,
      };
      const RESOURCE = {
        message:
          "Email sent. Go to your email account and finish the operation",
      };
      return return_response(res, 200, RESOURCE, LINKS, true);
    } catch (error) {
      AUTH_FOUND.reset_password_token = undefined;
      AUTH_FOUND.reset_password_expire = undefined;

      await AUTH_FOUND.save();
      return next(new CustomError(error.message, 500));
    }
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller that completes password change confirmation based
 * on the information encrypted in the parameter token.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the token is not same as the one stored in database or is invalid,
 * if the token is expired, if the user isn't found in database.
 */
async function reset_password(req, res, next) {
  try {
    const DECODED_TOKEN = JWT.verify(
      req.params.reset_token,
      process.env.JWT_SECRET
    );

    const ENCRYPTED_PASSWORD = DECODED_TOKEN.encrypted_password;

    const DECRYPTED_PASSWORD = CRYPTO_JS.AES.decrypt(
      ENCRYPTED_PASSWORD,
      process.env.SECRET
    ).toString(CRYPTO_JS.enc.Utf8);

    const USER_FOUND = await USER.findOne({
      _id: DECODED_TOKEN.user_id,
    });

    if (!USER_FOUND) {
      return next(
        new CustomError("Invalid token, no user find. Please, try again", 404)
      );
    }

    AUTH_FOUND = await AUTH.findOne({ user_id: DECODED_TOKEN.user_id });

    if (!are_equal(AUTH_FOUND.reset_password_token, req.params.reset_token)) {
      const LINKS = {
        forgot_password: AUTH_LINKS.FORGOT_PASSWORD,
      };
      const RESOURCE = {
        message: "Invalid token. Please, ask for a new password again.",
      };
      return return_response(res, 401, RESOURCE, LINKS, false);
    }

    if (is_greater_than(Date.now(), AUTH_FOUND.reset_password_expire)) {
      const LINKS = {
        forgot_password: AUTH_LINKS.FORGOT_PASSWORD,
      };
      const RESOURCE = {
        message: "Token has expired. Please, ask for a new password again.",
      };
      return return_response(res, 401, RESOURCE, LINKS, false);
    }

    USER_FOUND.password = DECRYPTED_PASSWORD;
    AUTH_FOUND.reset_password_token = undefined;
    AUTH_FOUND.reset_password_expire = undefined;
    await USER_FOUND.save();
    await AUTH_FOUND.save();

    const LINKS = {
      change_email: AUTH_LINKS.CHANGE_EMAIL,
      sign_in: AUTH_LINKS.SIGN_IN,
    };
    const RESOURCE = {
      message: "Change completed. Go and sign in with your new password",
    };

    return return_response(res, 200, RESOURCE, LINKS, true);
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller that removes authorization from the current user.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the user isn't found in database.
 */
async function sign_out(req, res, next) {
  try {
    const USER_FOUND = await USER.findOne({ _id: req.user.id });
    if (!USER_FOUND) {
      return next(new CustomError("User not found", 404));
    }
    USER_FOUND.is_active = false;
    await USER_FOUND.save();
    await BLACK_LISTED_TOKEN.create({
      user_id: USER_FOUND._id,
      token: req.cookies.jwt,
    });
    return delete_cookies_and_logout(req, res);
  } catch (error) {
    return next(error);
  }
}

/**
 * Removes all cookies from the request and logs out the user.
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @returns {void}
 */
function delete_cookies_and_logout(req, res) {
  const COOKIES = req.cookies;
  for (let COOKIE_NAME in COOKIES) {
    res.clearCookie(COOKIE_NAME, {
      path: "/",
      httpOnly: true,
      expires: new Date(0),
    });
  }

  const LINKS = {
    self: AUTH_LINKS.SIGN_OUT,
    sign_in: AUTH_LINKS.SIGN_IN,
    create: USER_LINKS.POST_NEW_USER,
  };
  const RESOURCE = {
    message: "You have logged out",
  };

  return return_response(res, 200, RESOURCE, LINKS, true);
}

/**
 * Controller sends a verification email to verify the new email
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If there is an error sending the email or if
 * the new email is already stored in database.
 */
async function change_email(req, res, next) {
  try {
    const USER_FOUND = await USER.findOne({ email: req.body.email });
    if (USER_FOUND) {
      return next(
        new CustomError(
          "An account associated with this email address has been detected. Try another",
          404
        )
      );
    }
    const VERIFICATION_CODE = UUID.v4();
    const VERIFICATION_EXPIRATION = Date.now() + 10 * (60 * 1000);
    const TOKEN = JWT.sign(
      {
        id: req.user.id,
        email: req.body.email,
        verification_code: VERIFICATION_CODE,
      },
      process.env.JWT_SECRET
    );
    const VERIFICATION_URL = `http://localhost:3000/v1/auth/new_email/${TOKEN}`;
    //esto despues va a ser un archivo html lindo
    const EMAIL_BODY = `
      <h1>Confirm verification</h1>
      <p>To confirm your change of email, click in the following link: </p>
      <a href='${VERIFICATION_URL}' clicktracking='off'>Verify new email</a>
    `;

    let AUTH_FOUND = await AUTH.findOne({ user_id: req.user.id });

    if (!AUTH_FOUND) {
      AUTH_FOUND = await AUTH.create({ user_id: req.user.id });
    }
    try {
      SEND_EMAIL({
        to: req.body.email,
        subject: "Verify your new email",
        text: EMAIL_BODY,
      });

      AUTH_FOUND.verification_code = VERIFICATION_CODE;
      AUTH_FOUND.verification_expire = VERIFICATION_EXPIRATION;

      await AUTH_FOUND.save();

      const LINKS = {
        self: AUTH_LINKS.CHANGE_EMAIL,
        forgot_password: AUTH_LINKS.FORGOT_PASSWORD,
        update_active: USER_LINKS.PUT_USER_BY_ID,
      };
      const RESOURCE = {
        message:
          "Email sent. Go to your email account and finish the operation",
      };
      return return_response(res, 200, RESOURCE, LINKS, true);
    } catch (error) {
      AUTH_FOUND.verification_code = undefined;
      AUTH_FOUND.verification_expire = undefined;

      await AUTH_FOUND.save();
      return next(new CustomError(error.message, 500));
    }
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller that verify a new email
 *
 * @param {Object} req - The request object from the HTTP request.
 * @param {Object} res - The response object from the HTTP response.
 * @param {Function} next - The next function in the middleware chain.
 * @throws {CustomError} If the user isn't found, if the verification
 * code doesn't match the one store in database, if it has expired,
 * if the updating fail or if the token is invalid.
 */
async function verify_new_email(req, res, next) {
  try {
    const PAYLOAD = JWT.verify(req.params.token, process.env.JWT_SECRET);

    let AUTH_FOUND = await AUTH.findOne({ user_id: PAYLOAD.id });

    if (!AUTH_FOUND) {
      AUTH_FOUND = await AUTH.create({ user_id: PAYLOAD.id });
    }

    if (!are_equal(PAYLOAD.verification_code, AUTH_FOUND.verification_code)) {
      const LINKS = {
        change_email: AUTH_LINKS.CHANGE_EMAIL,
      };
      const RESOURCE = {
        message:
          "Verification failed. Try to change email again with link below",
      };
      return return_response(res, 401, RESOURCE, LINKS, false);
    }

    if (AUTH_FOUND.is_verification_token_expired()) {
      const LINKS = {
        change_email: AUTH_LINKS.CHANGE_EMAIL,
      };
      const RESOURCE = {
        message:
          "Verification token expired. Try to change email again with link below",
      };
      return return_response(res, 401, RESOURCE, LINKS, false);
    }

    const USER_UPDATED = await USER.updateOne(
      { _id: PAYLOAD.id },
      { email: PAYLOAD.email }
    );

    if (USER_UPDATED.matchedCount <= 0) {
      return next(new CustomError(`User not found.`, 404));
    }

    if (USER_UPDATED.modifiedCount <= 0) {
      return next(new CustomError(`User not modified.`, 500));
    }

    AUTH_FOUND.verification_code = undefined;
    AUTH_FOUND.verification_expire = undefined;
    await AUTH_FOUND.save();

    const LINKS = {
      sign_in: AUTH_LINKS.SIGN_IN,
      forgot_password: AUTH_LINKS.FORGOT_PASSWORD,
    };
    const RESOURCE = {
      message: "Your new email have been verified, now go and sign in",
    };
    return return_response(res, 200, RESOURCE, LINKS, true);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  change_email,
  sign_in,
  send_verification_again,
  forgot_password,
  verify_account,
  reset_password,
  verify_new_email,
  sign_out,
};
