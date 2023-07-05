const URL = "https://api-user-management.cyclic.app/v1/users/";

const GET_ALL_USERS = {
  href: `${URL}`,
  method: "GET",
  description:
    "Get all the users that match the filters given by the queries, if there is any, else, it gets all users stored in database.\n" +
    "Users can access to certain information of the users, admin can access to all. In the queries, is specified.",
  usage: `${URL}?name=John&age=30&address.city=New%20York&interests=Football,Manchester%20United,Coding`,
  queries: [
    {
      query: "email",
      allowed_for_role: "ADMIN",
      description: "Filter by email",
      example: "example@gmail.com",
    },
    {
      query: "role",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by role",
      example: "ADMIN",
    },
    {
      query: "name",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by name",
      example: "John",
    },
    {
      query: "last_name",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by last name",
      example: "Jackson",
    },
    {
      query: "phone_number",
      allowed_for_role: "ADMIN",
      description: "Filter by phone number",
      example: "+15555555555",
    },
    {
      query: "country",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by country",
      example: "United States",
    },
    {
      query: "address.street",
      allowed_for_role: "ADMIN",
      description: "Filter by street",
      example: "123 False Street",
    },
    {
      query: "address.city",
      allowed_for_role: "ADMIN",
      description: "Filter by city",
      example: "New York",
    },
    {
      query: "address.state",
      allowed_for_role: "ADMIN",
      description: "Filter by state",
      example: "California",
    },
    {
      query: "address.zip_code",
      allowed_for_role: "ADMIN",
      description: "Filter by zip code",
      example: "12345",
    },
    {
      query: "age",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by age",
      example: "30",
    },
    {
      query: "gender",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by gender",
      example: "Female",
    },
    {
      query: "is_verified",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by if the user is verified",
      example: "true",
    },
    {
      query: "is_active",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by if the user is logged",
      example: "false",
    },
    {
      query: "is_public",
      allowed_for_role: "ADMIN",
      description: "Filter by if the user is public to see",
      example: "false",
    },
    {
      query: "studies",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by studies",
      example: [
        "Bachelor in Computer Science",
        "Degree in software development",
      ],
    },
    {
      query: "professions",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by profession",
      example: ["Software engineer", "Backend developer", "Father"],
    },
    {
      query: "interests",
      allowed_for_role: ["ADMIN", "USER"],
      description: "Filter by interests",
      example: ["Football", "Coding", "Manchester United"],
    },
  ],
};

const GET_USER_BY_ID = {
  href: `${URL}:id`,
  method: "GET",
  description:
    "Get a user's information by his id. Users can access to certain information, specifications below.",
  usage: `${URL}60a762dc8f7c670015e8fb34`,
  information_given: [
    {
      attribute: "email",
      allowed_for_role: "ADMIN",
    },
    {
      attribute: "role",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "name",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "last_name",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "phone_number",
      allowed_for_role: "ADMIN",
    },
    {
      attribute: "country",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "address",
      allowed_for_role: "ADMIN",
    },
    {
      attribute: "age",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "gender",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "is_verified",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "is_active",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "is_public",
      allowed_for_role: "ADMIN",
    },
    {
      attribute: "studies",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "professions",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "interests",
      allowed_for_role: ["ADMIN", "USER"],
    },
  ],
};

const GET_ACTIVE_USER = {
  href: `${URL}active`,
  method: "GET",
  description:
    "Get the information of the logged user. All information is given.",
  usage: `${URL}active`,
};

const POST_NEW_USER = {
  href: `${URL}`,
  method: "POST",
  description: "Creates a new user.",
  required_body: {
    email: {
      requirements: "Must be a valid email",
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
    password: "User1234$",
  },
};

const PUT_USER_BY_ID = {
  href: `${URL}:id`,
  method: "PUT",
  description:
    "Update a user's information by its id. Only admins can change others user's information. Users can only change their" +
    " information, but not all of them, by writing their id or 'active' as a parameter" +
    " of the route. And no one can change a password by this route.",
  body: [
    {
      attribute: "email",
      allowed_for_role: "ADMIN",
      requirements: "Must be a valid email",
    },
    {
      attribute: "role",
      allowed_for_role: ["ADMIN", "USER"],
      requirements: "Must be 'USER' or 'ADMIN'",
    },
    {
      attribute: "name",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "last_name",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "phone_number",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "country",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "address",
      allowed_for_role: ["ADMIN", "USER"],
      requirements: "Must be an object type",
    },
    {
      attribute: "age",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "gender",
      allowed_for_role: ["ADMIN", "USER"],
      requirements: "Must be 'Male', 'Female' or 'Other'",
    },
    {
      attribute: "is_public",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "studies",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "professions",
      allowed_for_role: ["ADMIN", "USER"],
    },
    {
      attribute: "interests",
      allowed_for_role: ["ADMIN", "USER"],
    },
  ],
  example_body: {
    email: "example@gmail.com",
    age: 30,
    address: {
      street: "123 False Street",
      city: "New York",
      state: "New York",
      zip_code: "12345",
    },
    phone_number: "+555555555",
    interests: ["Football", "Coding", "Manchester United"],
  },
};

const DELETE_USER_BY_ID = {
  href: `${URL}:id`,
  method: "DELETE",
  description:
    "Delete a user by its id. Role ADMIN can delete any user, role USER only themselves by writing 'active' as a parameter of the route",
  usage: `${URL}60a762dc8f7c670015e8fb34`,
};

const SEND_FEEDBACK = {
  href: `${URL}feedback`,
  method: "POST",
  description: "To send feedback to me about this API",
  required_body: [
    {
      attribute: "email",
      requirements: "Must be a valid email",
    },
    {
      attribute: "name",
    },
    {
      attribute: "text",
    },
  ],
  example_body: {
    email: "example@gmail.com",
    name: "Max Power",
    text: "I would like to see the ability to upload photos from your computer as a profile picture, instead of just adding the url.",
  },
};

module.exports = {
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_ACTIVE_USER,
  POST_NEW_USER,
  PUT_USER_BY_ID,
  DELETE_USER_BY_ID,
  SEND_FEEDBACK,
};
