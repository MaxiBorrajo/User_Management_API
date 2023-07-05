const URL = "https://api-user-management.cyclic.app/v1/auth/";

const SIGN_IN = {
  href: `${URL}`,
  method: "POST",
  description:
    "Post an email and password to sign in and get access to other endpoints.",
  required_body: {
    email: {
      requirements: "Must be a valid email and be stored in database",
    },
    password: {
      requirements: [
        "Must have at least one lowercase letter",
        "Must have at least one uppercase letter",
        "Must have at least one digit",
        "Must have at least one special character",
        "Must have 8 characters or longer",
        "Must be equal to the password associated with the user",
      ],
    },
  },
  example_body: {
    email: "example@gmail.com",
    password: "User1234$",
  },
};

const SEND_VERIFICATION_AGAIN = {
  href: `${URL}verification`,
  method: "POST",
  description:
    "Post an email to send a link to verify the associated account.",
  required_body: {
    email: {
      requirements: "Must be a valid email and be stored in database",
    }
  },
  example_body: {
    email: "example@gmail.com"
  },
};

const FORGOT_PASSWORD = {
  href: `${URL}new_password`,
  method: "POST",
  description:
    "Post an email to send a link to change the password of the associated account.",
  required_body: {
    email: {
      requirements: "Must be a valid email and be stored in database",
    },
    password: {
      requirements: [
        "Must have at least one lowercase letter",
        "Must have at least one uppercase letter",
        "Must have at least one digit",
        "Must have at least one special character",
        "Must have 8 characters or longer",
      ],
    },
  },
  example_body: {
    email: "example@gmail.com",
    password:"User1234$"
  },
};


const SIGN_OUT = {
  href: `${URL}`,
  method: "DELETE",
  description:
    "Delete the authorization of the active account. Basically, is a sign out endpoint."
};


const CHANGE_EMAIL = {
  href: `${URL}new_email`,
  method: "POST",
  description:
    "Post an email to send a link to verify it.",
  required_body: {
    email: {
      requirements: "Must be a valid email",
    }
  },
  example_body: {
    email: "example@gmail.com"
  },
};

module.exports = {
  CHANGE_EMAIL,
  FORGOT_PASSWORD,
  SEND_VERIFICATION_AGAIN,
  SIGN_IN,
  SIGN_OUT
};
