const httpStatus = require('http-status');
const passport = require('passport');
const catchAsync = require('../utils/catchAsync');
const { authService, userService, tokenService, emailService, mfaService } = require('../services');

const register = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  const tokens = await tokenService.generateAuthTokens(user);
  res.status(httpStatus.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.loginUserWithEmailAndPassword(email, password);
  let tokens = {};

  if (user.mfaEnabled === true) {
    tokens = await tokenService.generateVerifyMfaToken(user);
  } else {
    tokens = await tokenService.generateAuthTokens(user);
  }

  res.send({ user, tokens });
});

const logout = catchAsync(async (req, res) => {
  await authService.logout(req.body.refreshToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const refreshTokens = catchAsync(async (req, res) => {
  const tokens = await authService.refreshAuth(req.body.refreshToken);
  res.send({ ...tokens });
});

const forgotPassword = catchAsync(async (req, res) => {
  const resetPasswordToken = await tokenService.generateResetPasswordToken(req.body.email);
  await emailService.sendResetPasswordEmail(req.body.email, resetPasswordToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const resetPassword = catchAsync(async (req, res) => {
  await authService.resetPassword(req.query.token, req.body.password);
  res.status(httpStatus.NO_CONTENT).send();
});

const sendVerificationEmail = catchAsync(async (req, res) => {
  const verifyEmailToken = await tokenService.generateVerifyEmailToken(req.user);
  await emailService.sendVerificationEmail(req.user.email, verifyEmailToken);
  res.status(httpStatus.NO_CONTENT).send();
});

const verifyEmail = catchAsync(async (req, res) => {
  await authService.verifyEmail(req.query.token);
  res.status(httpStatus.NO_CONTENT).send();
});

const enableMfa = catchAsync(async (req, res) => {
  const mfaSecret = await mfaService.enableTotpMfa(req.headers.authorization.split(' ')[1]);
  res.send(mfaSecret).send();
});

const verifyMfa = catchAsync(async (req, res) => {
  const tokens = await mfaService.verifyLoginMfa(req.headers.authorization.split(' ')[1], req.body.mfaToken);
  res.send({ ...tokens });
});

const disableMfa = catchAsync(async (req, res) => {
  const tokens = await mfaService.disableMfa(req.headers.authorization.split(' ')[1], req.body.mfaToken);
  res.send({ ...tokens });
});

const loginFacebook = catchAsync(async (req, res) => {
  await passport.authenticate('facebook', { session: false }, async (err, user) => {
    if (err || !user) {
      return res.redirect('/login');
    }

    let tokens = {};

    if (user.mfaEnabled === true) {
      tokens = await tokenService.generateVerifyMfaToken(user);
    } else {
      tokens = await tokenService.generateAuthTokens(user);
    }

    const cookiePayload = { user, tokens };

    res.cookie('auth', JSON.stringify(cookiePayload), { domain: 'Replace' });

    res.send({ user, tokens });
  });
});

module.exports = {
  register,
  login,
  logout,
  refreshTokens,
  forgotPassword,
  resetPassword,
  sendVerificationEmail,
  verifyEmail,
  enableMfa,
  verifyMfa,
  disableMfa,
  loginFacebook,
};
