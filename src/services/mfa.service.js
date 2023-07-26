const { authenticator } = require('otplib');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ApiError = require('@utils/ApiError');
const { tokenTypes } = require('@config/tokens');
const config = require('@config/config');
const userService = require('./user.service');
const tokenService = require('./token.service');

/**
 * Encrypted MFA secret.
 * @returns {object}
 */
const generateEncryptedSecret = async () => {
  const secret = authenticator.generateSecret();

  const cipher = crypto.createCipheriv(
    config.mfa.encryptAlgo,
    crypto.pbkdf2Sync(
      config.mfa.encryptSecret,
      config.mfa.encryptIv,
      config.mfa.encryptKeyIterations,
      config.mfa.encryptKeyLength,
      'sha512',
    ),
    Buffer.from(config.mfa.encryptIv, 'hex'),
  );

  let encryptedSecret = cipher.update(secret, 'utf-8', 'hex');
  encryptedSecret += cipher.final('hex');

  return { secret, encryptedSecret };
};

/**
 * Decrypt MFA secret.
 * @param {string} secret
 * @returns {string}
 */
const decryptSecret = async (encryptedSecret) => {
  const decipher = crypto.createDecipheriv(
    config.mfa.encryptAlgo,
    crypto.pbkdf2Sync(
      config.mfa.encryptSecret,
      config.mfa.encryptIv,
      config.mfa.encryptKeyIterations,
      config.mfa.encryptKeyLength,
      'sha512',
    ),
    Buffer.from(config.mfa.encryptIv, 'hex'),
  );

  let decryptedSecret = decipher.update(encryptedSecret, 'hex', 'utf-8');

  decryptedSecret += decipher.final('utf8');

  return decryptedSecret;
};

/**
 * Verify TOTP token against encrypted mfaSecret.
 * @param {string} encryptedMfaSecret
 * @param {number} totpToken
 * @returns {boolean}
 */
const verifyTotpToken = async (encryptedMfaSecret, totpToken) => {
  const mfaSecret = await decryptSecret(encryptedMfaSecret);
  return authenticator.check(totpToken, mfaSecret);
};

/**
 * Verify MFA code and complete enable MFA process if not already enabled. Completes login process if MFA already enabled.
 * @param {string} verifyMfaToken Encoded JWT
 * @param {number} mfaToken MFA token submitted by users.
 * @returns {object} If user submits token with type VERIFY_MFA completes login process and returns ACCESS and REFRESH tokens otherwise returns empty object.
 */
const verifyLoginMfa = async (verifyMfaToken, mfaToken) => {
  try {
    const jwtPayload = jwt.verify(verifyMfaToken, config.jwt.secret);

    if (![tokenTypes.ACCESS, tokenTypes.VERIFY_MFA].includes(jwtPayload.type)) {
      throw new ApiError('unauthorized');
    }

    const user = await userService.getUserById(jwtPayload.sub);

    if (!user.mfaSecret || user.mfaSecret === '') {
      throw new ApiError('mfaNotEnabled');
    }

    // VS CODE flags this await as unnecessary but a promise is in fact returned if await is not used.
    const toptResult = await verifyTotpToken(user.mfaSecret, mfaToken);

    if (toptResult !== true) {
      throw new ApiError('invalidMfaToken');
    }

    if (!user.mfaEnabled) {
      await userService.updateUserById(user.id, { mfaEnabled: true });
    }

    if (jwtPayload.type === tokenTypes.VERIFY_MFA) {
      const tokens = await tokenService.generateAuthTokens(user);
      return { user, tokens };
    }

    return {};
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError('unknownError');
    }
  }
};

/**
 * Generate a new customer MFA TOTP secret and add it to their account. MFA is not enabled for the user until they verify a MFA code.
 * @param {sting} enableMfaToken Encoded JWT
 * @returns {object} Includes MFA secret as string as well as encoded in URL for QR code generation by frontend.
 */
const enableTotpMfa = async (enableMfaToken) => {
  try {
    const jwtPayload = jwt.verify(enableMfaToken, config.jwt.secret);

    if (jwtPayload.type !== tokenTypes.ACCESS) {
      throw new ApiError('unauthorized');
    }
    const user = await userService.getUserById(jwtPayload.sub);

    if (user.mfaEnabled) {
      throw new ApiError('mfaAlreadyEnabled');
    }
    const mfaSecret = await generateEncryptedSecret();
    await userService.updateUserById(user.id, {
      mfaSecret: mfaSecret.encryptedSecret,
    });
    return {
      mfaSecret: mfaSecret.secret,
      otpauth: authenticator.keyuri(user.email, config.mfa.serviceName, mfaSecret.secret),
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError('unknownError');
    }
  }
};

/**
 * Disable MFA for user after verifying MFA code.
 * @param {string} disableMfaToken Encoded JWT
 * @param {number} mfaToken MFA code submitted by users.
 * @returns {boolean}
 */
const disableMfa = async (disableMfaToken, mfaToken) => {
  try {
    const jwtPayload = jwt.verify(disableMfaToken, config.jwt.secret);

    if (jwtPayload.type !== tokenTypes.ACCESS) {
      throw new ApiError('unauthorized');
    }
    const user = await userService.getUserById(jwtPayload.sub);

    if (!user.mfaEnabled || user.mfaSecret === '') {
      throw new ApiError('mfaNotEnabled');
    }

    // VS CODE flags this await as unnecessary but a promise is in fact returned if await is not used.
    const toptResult = await verifyTotpToken(user.mfaSecret, mfaToken);

    if (toptResult !== true) {
      throw new ApiError('invalidMfaToken');
    }

    await userService.updateUserById(user.id, {
      mfaEnabled: false,
      mfaSecret: '',
    });
    return true;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    } else {
      throw new ApiError('mfaDisableFailed');
    }
  }
};

module.exports = {
  enableTotpMfa,
  verifyLoginMfa,
  disableMfa,
  generateEncryptedSecret,
  decryptSecret,
  verifyTotpToken,
};
