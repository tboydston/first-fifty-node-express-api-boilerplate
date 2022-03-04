const axios = require('axios');
const httpStatus = require('http-status');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');

const providerVerifyAddresses = {
  reCaptchaV2: 'https://www.recaptcha.net/recaptcha/api/siteverify',
  reCaptchaV3: 'https://www.recaptcha.net/recaptcha/api/siteverify',
  hCaptcha: 'https://hcaptcha.com/siteverify',
};

const verify = async (req, res, next) => {
  try {
    if (config.captcha.enabled === false) {
      return next();
    }

    if (config.env === 'prod' && config.captcha.secret === '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe') {
      logger.error('Test CAPTCHA key being used in production. All captcha validation requests will fail until updated.');
      throw new Error();
    }

    const verifyPayload = {
      secret: config.captcha.secret,
      response: req.header('Captcha-Response-Token'),
    };

    const scoreThreshold =
      req.originalUrl in config.captcha.scoreThresholds.overrides
        ? config.captcha.scoreThresholds.overrides[req.originalUrl]
        : config.captcha.scoreThresholds.default;

    const verifyResponse = await axios.post(providerVerifyAddresses[config.captcha.provider], null, {
      params: verifyPayload,
    });

    if (verifyResponse.data.success !== true) {
      throw new Error();
    }
    if ('score' in verifyResponse.data) {
      if (
        // hCaptcha and reCaptchaV3 have inverted valuations of each other.
        (config.captcha.provider === 'hCaptcha' && verifyResponse.data.score > scoreThreshold) ||
        (config.captcha.provider === 'reCaptchaV3' && verifyResponse.data.score <= scoreThreshold)
      ) {
        throw new Error();
      }
    }
    return next();
  } catch (error) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Error validating captcha.'));
  }
};

module.exports = {
  verify,
};

if (config.env === 'test') {
  module.exports.config = config;
}
