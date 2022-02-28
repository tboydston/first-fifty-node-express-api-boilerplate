const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');
const crypto = require('crypto');

dotenv.config({ path: path.join(__dirname, '../../.env') });
const validMfaCipherAlgos = crypto.getCiphers();

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
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
    SMTP_USERNAME: Joi.string().description('username for email server'),
    SMTP_PASSWORD: Joi.string().description('password for email server'),
    EMAIL_FROM: Joi.string().description('the from field in the emails sent by the app'),
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
        'MFA Key length. If you change the MFA_ENCRYPTION_ALGO you many need to adjust this to match the new ciphers key length.'
      ),
    MFA_ENCRYPTION_KEY_ITERATIONS: Joi.number()
      .default(10)
      .description('Number of iterations the MFA secret is hashed into a key.'),
    MFA_ENCRYPTION_IV: Joi.string()
      .default('fb1f4b0a7daaada6cae678df32fad0f0')
      .description(
        'Initialization Vector used encrypt MFA secrets stored in database. Size is dependant on chosen cipher algorithm.'
      ),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  mongoose: {
    url: envVars.MONGODB_URL + (envVars.NODE_ENV === 'test' ? '-test' : ''),
    options: {
      useCreateIndex: true,
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
};
