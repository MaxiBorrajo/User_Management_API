# User Management API

This API provides basic functionality for creating, updating, and deleting users. User authentication and authorization are implemented using Json Web Token and user roles. The stack used includes MongoDB, Express, and Node.js. This is my first significant API project, and I welcome feedback from the community to enhance its quality.
## First steps

To get started, the first step is to register yourself using the {POST} endpoint at https://api-user-management.cyclic.app/v1/users/ with your email address and password. An email will then be sent to you for account verification. Please check your email account and follow the verification process.

Next, the second step is to log in to the {POST} endpoint at https://api-user-management.cyclic.app/v1/auth/ using the previously submitted email and password. Once authenticated, a Bearer Token will be sent to you. Make sure to include this token in the Authorization header for accessing the remaining endpoints.
## Endpoints

**Base URL: https://api-user-management.cyclic.app/v1**

### Users

- **GET /users/**: Get all users that match the specified filters by queries (see specifications for more details).

- **GET /users/:id**: Get a user by their ID. Use 'active' as the ID to get the current user.

- **POST /users/**: Create a new user.

- **POST /users/feedback**: Send feedback about this API.

- **PUT /users/:id**: Update a user's information by their ID. Use 'active' as the ID to update the current user.

- **DELETE /users/:id**: Delete a user by their ID. Use 'active' as the ID to delete the current user.

### Authentication

- **POST /auth/**: Sign in with an email and password to get access to other endpoints.

- **POST /auth/verification**: Send an email to verify the associated account.

- **GET /auth/verification/:token**: Verify the account associated with the token.

- **POST /auth/new_password**: Send an email and new password to change the associated account's password.

- **GET /auth/new_password/:reset_token**: Update the associated account with the new password provided.

- **DELETE /auth/**: Delete the authorization of the active account (sign-out endpoint).

- **POST /auth/new_email**: Send an email to verify a new email.

- **GET /auth/new_email/:token**: Store the new email encrypted in the token and verify it.

Please refer to the respective route files (`user_route.js` and `auth_route.js`) and controller files (`user_controller.js` and `auth_controller.js`) for more detailed specifications of each endpoint.

## Feedback

I would greatly appreciate any feedback or suggestions from the community to improve the quality of this API. Feel free to open issues or submit pull requests with your ideas or contributions.

---

