const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const crypto = require('crypto');

dotenv.config({ path: path.join(__dirname, '../../.env') });
const validMfaCipherAlgos = crypto.getCiphers();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    FRONTEND_URL: Joi.string()
      .default('http://localhost')
      .description('URL of frontend. May be a dummy URL in dev environment.'),
    PORT: Joi.number().default(3000),
    MONGODB_URL: Joi.string().required().description('Mongo DB url'),
    JWT_SECRET: Joi.string().required().description('JWT secret key'),
    JWT_ACCESS_EXPIRATION_MINUTES: Joi.number().default(30).description('minutes after which access tokens expire'),
    JWT_REFRESH_EXPIRATION_DAYS: Joi.number().default(30).description('days after which refresh tokens expire'),
    JWT_RESET_PASSWORD_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which reset password token expires'),
    JWT_RESET_MFA_EXPIRATION_MINUTES: Joi.number().default(10).description('minutes after which reset mfa token expires'),
    JWT_VERIFY_EMAIL_EXPIRATION_MINUTES: Joi.number()
      .default(10)
      .description('minutes after which verify email token expires'),
    SMTP_HOST: Joi.string().description('server that will send the emails'),
    SMTP_PORT: Joi.number().description('port to connect to the email server'),
    SMTP_USERNAME: Joi.string().description('userName for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
    FORGOT_PASSWORD_SEND_INVALID_USER_RESPONSE: Joi.bool()
      .default('false')
      .description(
        'If a user submits an email that does not belong to any user tell them this in the response. This can be a security risk as it allows an attacker to confirm whether a user exists or not.',
      ),
    MFA_SERVICE_NAME: Joi.string()
      .default('Test MFA Service')
      .description('MFA service name that appears in authenticator app ( Google Authenticator, Authy, or similar )'),
    MFA_ENCRYPTION_ALGO: Joi.string()
      .custom((value, helper) => {
        return validMfaCipherAlgos.indexOf(value)
          ? value
          : helper.message(`${value} not valid cipher algorithm. Supported algorithms ${validMfaCipherAlgos.join(',')}`);
      })
      .default('aes-256-cbc')
      .description('Cipher algorithm used to encrypt/decrypt stored MFA secrets.'),
    MFA_ENCRYPTION_SECRET: Joi.string().required().description('Password used to encrypt MFA secrets stored in database.'),
    MFA_ENCRYPTION_KEY_LENGTH: Joi.number()
      .default(32)
      .description(
        'MFA Key length. If you change the MFA_ENCRYPTION_ALGO you many need to adjust this to match the new ciphers key length.',
      ),
    MFA_ENCRYPTION_KEY_ITERATIONS: Joi.number()
      .default(10)
      .description('Number of iterations the MFA secret is hashed into a key.'),
    MFA_ENCRYPTION_IV: Joi.string()
      .default('fb1f4b0a7daaada6cae678df32fad0f0')
      .description(
        'Initialization Vector used encrypt MFA secrets stored in database. Size is dependant on chosen cipher algorithm.',
      ),
    CAPTCHA_ENABLED: Joi.bool()
      .default('false')
      .description('This is a global option to enable or disable all captcha response validation.'),
    CAPTCHA_ROUTES: Joi.string()
      .default('')
      .description(
        'Routes on which captcha is enabled. Should be comma separated in quotations. Example: "/register,/login"',
      ),
    CAPTCHA_PROVIDER: Joi.string()
      .valid('reCaptchaV2', 'reCaptchaV3', 'hCaptcha')
      .default('reCaptchaV2')
      .description('Captcha service used. Currently supported options: reCaptchaV2, reCaptchaV3, hCaptcha'),
    CAPTCHA_DEFAULT_SCORE_THRESHOLD: Joi.number()
      .default(0.5)
      .description(
        'Threshold uses when no specific override is defined. Note: Only used by reCaptchaV3 and hCaptcha enterprise. Also note reCaptcha and hCaptcha us inverse scoring methods so make sure to invert the value if you switch providers.',
      ),
    CAPTCHA_PATH_SCORE_THRESHOLD_OVERRIDES: Joi.string()
      .default('{}')
      .description(
        'Override score values for specific routes. Object key should be the path returned in req.path usual "/path".',
      ),
    CAPTCHA_SECRET: Joi.string().description(
      'Secret issued by captcha provider Note: 6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe is Googles demo key using it wall cause all test to pass.',
    ),
    REGISTRATION_REQUIRED_FIELDS: Joi.string()
      .allow('')
      .default('')
      .description(
        'Field in addition to userName and password required for registration. May include firstName, lastName, company or userName. Should be comma separated. Example: "firstName,lastName"',
      ),
    REGISTRATION_APPEND_UUID_TO_USERNAMES: Joi.bool()
      .default('false')
      .description(
        "Append all userNames with a short UUID so that users don't have to try to find a unique userName. For example 'bob' would be 'bob_d8931d1b'.",
      ),
    LOGIN_ALLOW_USERNAME: Joi.bool()
      .default('false')
      .description('Allows login with either username and password or email and password.'),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  frontEndUrl: envVars.FRONTEND_URL,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  jwt: {
    secret: envVars.JWT_SECRET,
    accessExpirationMinutes: envVars.JWT_ACCESS_EXPIRATION_MINUTES,
    refreshExpirationDays: envVars.JWT_REFRESH_EXPIRATION_DAYS,
    resetPasswordExpirationMinutes: envVars.JWT_RESET_PASSWORD_EXPIRATION_MINUTES,
    verifyMfaExpirationMinutes: envVars.JWT_RESET_MFA_EXPIRATION_MINUTES,
    verifyEmailExpirationMinutes: envVars.JWT_VERIFY_EMAIL_EXPIRATION_MINUTES,
  },
  forgotPassword: {
    sendInvalidUserResponse: envVars.FORGOT_PASSWORD_SEND_INVALID_USER_RESPONSE,
  },
  mfa: {
    serviceName: envVars.MFA_SERVICE_NAME,
    encryptAlgo: envVars.MFA_ENCRYPTION_ALGO,
    encryptSecret: envVars.MFA_ENCRYPTION_SECRET,
    encryptKeyLength: envVars.MFA_ENCRYPTION_KEY_LENGTH,
    encryptKeyIterations: envVars.MFA_ENCRYPTION_KEY_ITERATIONS,
    encryptIv: envVars.MFA_ENCRYPTION_IV,
  },
  email: {
    smtp: {
      host: envVars.SMTP_HOST,
      port: envVars.SMTP_PORT,
      auth: {
        user: envVars.SMTP_USERNAME,
        pass: envVars.SMTP_PASSWORD,
      },
    },
    from: envVars.EMAIL_FROM,
  },
  captcha: {
    enabled: envVars.CAPTCHA_ENABLED,
    routes: envVars.CAPTCHA_ROUTES.split(','),
    provider: envVars.CAPTCHA_PROVIDER,
    secret: envVars.CAPTCHA_SECRET,
    scoreThresholds: {
      default: envVars.CAPTCHA_DEFAULT_SCORE_THRESHOLD,
      overrides: JSON.parse(envVars.CAPTCHA_PATH_SCORE_THRESHOLD_OVERRIDES),
    },
  },
  registration: {
    requiredFields: envVars.REGISTRATION_REQUIRED_FIELDS.split(','),
    appendUUIDtoUserNames: envVars.REGISTRATION_APPEND_UUID_TO_USERNAMES,
  },
  login: {
    allowUsername: envVars.LOGIN_ALLOW_USERNAME,
  },
};
