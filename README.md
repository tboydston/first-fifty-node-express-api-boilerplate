# First 50% RESTful API Node Server Boilerplate

[![Build Status](https://travis-ci.org/hagopj13/node-express-boilerplate.svg?branch=master)](https://travis-ci.org/hagopj13/node-express-boilerplate)
[![Coverage Status](https://coveralls.io/repos/github/hagopj13/node-express-boilerplate/badge.svg?branch=master)](https://coveralls.io/github/hagopj13/node-express-boilerplate?branch=master)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

First fifty is a boilerplate/starter project for quickly building secure RESTful APIs using Node.js, Express, and Mongoose.

By running a single command you can complete the first tedious 50% of your project and deliver a production-ready Node.js app installed and fully configured. The app comes with many built-in features, such as authentication using JWT, MFA, request validation, unit and integration tests, continuous integration, docker support, API documentation, pagination, etc. For more details, check the features list below.

<!-- ## Quick Start

To create a project, simply run:

```bash
npx create-nodejs-express-app <project-name>
```

Or

```bash
npm init nodejs-express-app <project-name>
``` -->

## Manual Installation

If you would still prefer to do the installation manually, follow these steps:

Clone the repo:

```bash
git clone --depth 1 https://github.com/hagopj13/node-express-boilerplate.git
cd node-express-boilerplate
npx rimraf ./.git
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

## Table of Contents

- [Features](#features)
- [Commands](#commands)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Error Handling](#error-handling)
- [Validation](#validation)
- [Authentication](#authentication)
- [Multi-Factor Authentication(MFA)](#multi-factor-authentication-mfa)
- [Captcha](#captcha)
- [Authorization](#authorization)
- [Logging](#logging)
- [Custom Mongoose Plugins](#custom-mongoose-plugins)
- [Linting](#linting)
- [Contributing](#contributing)

## Features

- **NoSQL database**: [MongoDB](https://www.mongodb.com) object data modeling using [Mongoose](https://mongoosejs.com)
- **Authentication and authorization**: using [passport](http://www.passportjs.org)
- **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
- **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
- **Testing**: unit and integration tests using [Jest](https://jestjs.io)
- **Error handling**: centralized error handling mechanism
- **API documentation**: with [swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc) and [swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)
- **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
- **Dependency management**: with [Yarn](https://yarnpkg.com)
- **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
- **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
- **MFA**: validate TOTP tokens ( [Google Authenicator](https://www.google.com/landing/2step/), [Authy](https://authy.com/) ) using [otplib](https://github.com/yeojz/otplib)
- **Captcha**: validate response tokens for [reCaptchaV2, reCaptchaV3](https://www.google.com/recaptcha/about/), and [hCaptcha](https://www.hcaptcha.com/)
- **Santizing**: sanitize request data against xss and query injection
- **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
- **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
- **CI**: continuous integration with [Travis CI](https://travis-ci.org)
- **Docker support**
- **Code coverage**: using [coveralls](https://coveralls.io)
- **Code quality**: with [Codacy](https://www.codacy.com)
- **Git hooks**: with [husky](https://github.com/typicode/husky) and [lint-staged](https://github.com/okonet/lint-staged)
- **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)
- **Editor config**: consistent editor configuration using [EditorConfig](https://editorconfig.org)

## Commands

Running locally:

```bash
yarn dev
```

Running in production:

```bash
yarn start
```

Testing:

```bash
# run all tests
yarn test

# run all tests in watch mode
yarn test:watch

# run test coverage
yarn coverage
```

Docker:

```bash
# run docker container in development mode
yarn docker:dev

# run docker container in production mode
yarn docker:prod

# run all tests in a docker container
yarn docker:test
```

Linting:

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash

# Set environment
NODE_ENV=development

# Port number
PORT=3000

# URL of the Mongo DB
MONGODB_URL=mongodb://127.0.0.1:27017/node-boilerplate

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
# Number of minutes after which an access token expires
JWT_ACCESS_EXPIRATION_MINUTES=30
# Number of days after which a refresh token expires
JWT_REFRESH_EXPIRATION_DAYS=30

# SMTP configuration options for the email service
# For testing, you can use a fake SMTP service like Ethereal: https://ethereal.email/create
SMTP_HOST=email-server
SMTP_PORT=587
SMTP_USERNAME=email-server-username
SMTP_PASSWORD=email-server-password
EMAIL_FROM=support@yourapp.com

# Forgot Password
# Determines if the forgot password API should tell the user if the submitted email address doesn't exists. This can be a security risk on platforms where email addresses are private because it will tell an attacker if a specific account exists on the platform.
FORGOT_PASSWORD_SEND_INVALID_USER_RESPONSE=false

# MFA
# MFA service name that appears in authenticator app ( Google Authenticator, Authy, or similar )
MFA_SERVICE_NAME=Test MFA Service
# Cipher algorithm used to encrypt/decrypt stored MFA secrets.'
MFA_ENCRYPTION_ALGO=aes-256-cbc
# MFA key length. If you change the MFA_ENCRYPTION_ALGO you many need to adjust this to match the new ciphers key length.
MFA_ENCRYPTION_KEY_LENGTH=32
# Number of iterations the MFA secret is hashed into a key.
MFA_ENCRYPTION_KEY_ITERATIONS=10
# Password used to encrypt/decrypt MFA secrets stored in database.
MFA_ENCRYPTION_SECRET=thisisasampletextkey
# Initialization Vector used encrypt/decrypt MFA secrets stored in database. Size is dependant on chosen cipher algorithm.
MFA_ENCRYPTION_IV=fb1f4b0a7daaada6cae678df32fad0f0

# Captcha
# Global option to enable or disable all captcha response validation.
CAPTCHA_ENABLED=true
# Routes on which captcha is enabled. Should be comma separated in quotations. Example: "/register,/login"
CAPTCHA_ROUTES="/register-captcha-test"
# Captcha service used. Currently supported options: reCaptchaV2, reCaptchaV3, hCaptcha
CAPTCHA_PROVIDER=reCaptchaV2
# Secret issued by captcha provider Note: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe is Googles demo key.
CAPTCHA_SECRET=6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
# Threshold uses when no specific override is defined. Note: Only used by reCaptchaV3 and hCaptcha enterprise. Also note reCaptcha and hCaptcha us inverse scoring methods so make sure to invert the value if you switch providers.
CAPTCHA_DEFAULT_SCORE_THRESHOLD=0.50
# Override score values for specific routes. Object key should be the path returned in req.path usual "/path".
CAPTCHA_PATH_SCORE_THRESHOLD_OVERRIDES= {"/demo":0.9}

# Registration
# Field in addition to username and password required for registration. May include firstName, lastName, company or username. Should be comma separated. Example: "firstName,lastName"
REGISTRATION_REQUIRED_FIELDS=
# Append all usernames with a short UUID so that users don't have to try to find a unique username. For example 'bob' would be 'bob_d8931d1b'.
REGISTRATION_APPEND_UUID_TO_USERNAMES=false

# Login
# Allows login with either username and password or email and password.
LOGIN_ALLOW_USERNAME=true
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--docs\           # Swagger files
 |--middlewares\    # Custom express middlewares
 |--models\         # Mongoose models (data layer)
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--validations\    # Request data validation schemas
 |--app.js          # Express app
 |--index.js        # App entry point
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3000/v1/docs` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Auth routes**:\
`POST /v1/auth/register` - register\
`POST /v1/auth/login` - login\
`POST /v1/auth/refresh-tokens` - refresh auth tokens\
`POST /v1/auth/forgot-password` - send reset password email\
`POST /v1/auth/reset-password` - reset password\
`POST /v1/auth/send-verification-email` - send verification email\
`POST /v1/auth/verify-email` - verify email\
`POST /v1/auth/enable-mfa` - begin enable MFA process\
`POST /v1/auth/verify-mfa` - verify mfa token\
`POST /v1/auth/disable-mfa` - disable mfa

**User routes**:\
`POST /v1/users` - create a user\
`GET /v1/users` - get all users\
`GET /v1/users/:userId` - get user\
`PATCH /v1/users/:userId` - update user\
`DELETE /v1/users/:userId` - delete user

## Registration and Login fields.

By defaults the only required registration fields are email and password. Additional fields may be added by setting the REGISTRATION_REQUIRED_FIELDS environment variable. Currently firstName, lastName, company, and userName may also be required. If additional fields are added you should update the swagger documentation in the auth.route.js and user.route.js files to reflect the required fields.

If the REGISTRATION_APPEND_UUID_TO_USERNAMES environment variable is set to 'true' a random 8 character code will be suffixed to each username. For example the user name 'bob' would be registered as 'bob-382ae2fa'. This is to prevent users from having to hunt for unique users names. When using this feature it is best to use some other distinguishing aspect to prevent user impersonation such as using the uuid portion of the username to generate a unique avatar of user color scheme. By default usernames must be between 3 and 30 characters and may only contain alphanumeric characters and the symbols '.' and '\*' .

### UserName Login

Username login may be enabled by setting the LOGIN_ALLOW_USERNAME environment variable to true. If enabled. A user may login with either their email or their username.

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```javascript
const catchAsync = require('@utils/catchAsync');

const controller = catchAsync(async (req, res) => {
  // this error will be forwarded to the error handling middleware
  throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
  "code": 404,
  "type": "notFound"
  "message": "Not found"
}
```

Text for error responses can be added or edited in the src/config/errors.js file.

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (catchAsync will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```javascript
const httpStatus = require('http-status');
const ApiError = require('@utils/ApiError');
const User = require('@models/User');

const getUser = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError('userNotFound');
  }
};
```

## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const express = require('express');
const validate = require('@middlewares/validate');
const userValidation = require('@validations/user.validation');
const userController = require('@controllers/user.controller');

const router = express.Router();

router.post('/users', validate(userValidation.createUser), userController.createUser);
```

## Authentication

To require authentication for certain routes, you can use the `auth` middleware.

```javascript
const express = require('express');
const auth = require('@middlewares/auth');
const userController = require('@controllers/user.controller');

const router = express.Router();

router.post('/users', auth(), userController.createUser);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the register (`POST /v1/auth/register`) or login (`POST /v1/auth/login`) endpoints. The response of these endpoints also contains refresh tokens (explained below).

An access token is valid for 30 minutes. You can modify this expiration time by changing the `JWT_ACCESS_EXPIRATION_MINUTES` environment variable in the .env file.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by making a call to the refresh token endpoint (`POST /v1/auth/refresh-tokens`) and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

A refresh token is valid for 30 days. You can modify this expiration time by changing the `JWT_REFRESH_EXPIRATION_DAYS` environment variable in the .env file.

## Authorization

The `auth` middleware can also be used to require certain rights/permissions to access a route.

```javascript
const express = require('express');
const auth = require('@middlewares/auth');
const userController = require('@controllers/user.controller');

const router = express.Router();

router.post('/users', auth('manageUsers'), userController.createUser);
```

In the example above, an authenticated user can access this route only if that user has the `manageUsers` permission.

The permissions are role-based. You can view the permissions/rights of each role in the `src/config/roles.js` file.

If the user making the request does not have the required permissions to access this route, a Forbidden (403) error is thrown.

## Multi-Factor Authentication (MFA)

Time-based one-time password (TOTP) two factor authentication (2fa) supported by Google Authenticator, Authy, or similar soft token APPs can be enabled by an account for extra security.

Note: The service is referred to as MFA instead of 2FA even though only 2FA is supported to leave room for adding other authentication factors later.

### Enabling MFA

A user may enable TOTP by first calling the enable MFA endpoint (`POST /v1/auth/enable-mfa`) with a JWT of type 'access'. This will generate a TOTP secret which will be stored in the DB and returned to the users as text and in [Key URI Format](https://github.com/google/google-authenticator/wiki/Key-Uri-Format) that can be used by to generate a QR code readable by TOTP APPs.

MFA is not enabled for the account until the verify MFA endpoint (`POST /v1/auth/verify-mfa`) is called with a valid MFA token generated by the TOTP app.

### Using MFA

When MFA is enabled by the user they will be required to submit a valid MFA token to login. After calling the login endpoint (`POST /v1/auth/login`) they will receive a JWT of type 'verifyMfa' that is only valid for calling the verify mfa endpoint. After this endpoint is called successfully a JWT of type 'access' will return with full logged in privileges.

### Disable MFA

If a customer has enabled MFA they may disabled it be calling the disable MFA endpoint (`POST /v1/auth/disable-mfa`) with a JWT of type 'access' and a valid MFA token generated from their current TOTP device. Once disabled a MFA token is no longer required to login. If the user has lost their TOTP device they will need to contact an administrator to disable MFA.

## Captcha

The captcha middleware supports reCaptchaV2, score based reCaptchaV3, hCaptcha, and score based hCaptcha Enterprise response token validation. To enable captcha validations you can add the captcha middleware to a route middleware chain that you would like to validate captcha responses.

```javascript
router.post('/register-captcha-test', captcha.verify, validate(authValidation.register), authController.register);
```

You can also add routes to the CAPTCHA_ROUTES config variable and then add the line below to the top of your list of routes to enable CAPTCHA on all specified routes. See routes/v1/auth.route.js for an example.

```javascript
router.use(config.captcha.routes, captcha.verify);
```

The API expects the response token to be in the 'Captcha-Response-Token' header.

## Logging

Import the logger from `src/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger = require('<path to src>/config/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

## Custom Mongoose Plugins

The app also contains 2 custom mongoose plugins that you can attach to any mongoose model schema. You can find the plugins in `src/models/plugins`.

```javascript
const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    /* schema definition here */
  },
  { timestamps: true }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

const User = mongoose.model('User', userSchema);
```

### toJSON

The toJSON plugin applies the following changes in the toJSON transform call:

- removes \_\_v, createdAt, updatedAt, and any schema path that has private: true
- replaces \_id with id

### paginate

The paginate plugin adds the `paginate` static method to the mongoose schema.

Adding this plugin to the `User` model schema will allow you to do the following:

```javascript
const queryUsers = async (filter, options) => {
  const users = await User.paginate(filter, options);
  return users;
};
```

The `filter` param is a regular mongo filter.

The `options` param can have the following (optional) fields:

```javascript
const options = {
  sortBy: 'name:desc', // sort order
  limit: 5, // maximum results per page
  page: 2, // page number
};
```

The plugin also supports sorting by multiple criteria (separated by a comma): `sortBy: name:desc,role:asc`

The `paginate` method returns a Promise, which fulfills with an object having the following properties:

```json
{
  "results": [],
  "page": 2,
  "limit": 5,
  "totalPages": 10,
  "totalResults": 48
}
```

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.

To maintain a consistent coding style across different IDEs, the project contains `.editorconfig`

## Path Aliasing

Path Aliasing e.g.  `` require('@control/user') `` as opposed to `` require('../../../user') `` is done with the [module-alias](https://www.npmjs.com/package/module-alias) module. Aliases may be managed by updating the following section of the package.json file.

```

"_moduleAliases": {
  "@root": ".",
  "@src": "src",
  "@config": "src/config",
  "@helpers": "src/helpers",
  "@controllers": "src/controllers",
  "@docs": "src/docs",
  "@middlewares": "src/middlewares",
  "@models": "src/models",
  "@routes": "src/routes",
  "@servicse": "src/services",
  "@utils": "src/utils",
  "@validations": "src/validations"
},

```

Jest manages it's own aliases so you will also need to manage the aliases in the jest.config.js file.

```

  moduleNameMapper: {
  "^@root(.*)$": "<rootDir>/$1",
  "^@src(.*)$": "<rootDir>/src/$1",
  "^@config(.*)$": "<rootDir>/src/config/$1",
  "^@helpers(.*)$": "<rootDir>/src/helpers/$1",
  "^@controllers(.*)$": "<rootDir>/src/controllers/$1",
  "^@docs(.*)$": "<rootDir>/src/docs/$1",
  "^@middlewares(.*)$": "<rootDir>/src/middlewares/$1",
  "^@models(.*)$": "<rootDir>/src/models/$1",
  "^@routes(.*)$": "<rootDir>/src/routes/$1",
  "^@utils(.*)$": "<rootDir>/src/utils/$1",
  "^@services(.*)$": "<rootDir>/src/services/$1",
  "^@validations(.*)$": "<rootDir>/src/validations/$1"
},

```

## Contributing

Contributions are more than welcome! Please check out the [contributing guide](CONTRIBUTING.md).

## Inspirations

This project is an extension of the work done by [hagopj13](https://github.com/hagopj13) in [node-express-boilerplate](https://github.com/hagopj13/node-express-boilerplate) which was itself inspired by the projects below.

- [danielfsousa/express-rest-es2017-boilerplate](https://github.com/danielfsousa/express-rest-es2017-boilerplate)
- [madhums/node-express-mongoose](https://github.com/madhums/node-express-mongoose)
- [kunalkapadia/express-mongoose-es6-rest-api](https://github.com/kunalkapadia/express-mongoose-es6-rest-api)

## License

[MIT](LICENSE)
