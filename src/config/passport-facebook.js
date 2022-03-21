const FacebookStrategy = require('passport-facebook');
const mongoose = require('mongoose');
const Joi = require('joi');
const config = require('./config');
const { FederatedCredential, User } = require('../models');

const facebookOptions = {
  clientID: config.socialLogin.facebook.clientId,
  clientSecret: config.socialLogin.facebook.clientSecret,
  doneURL: `${config.publicUrl}auth/facebook/done`,
};

const manageLogin = async (accessToken, refreshToken, profile, done) => {
  try {

    const fedCredResult = await FederatedCredential.findOne({ federatedId: profile.id });

    if (!fedCredResult) {
      if (profile.emails.length === 0 || !Joi.string().email().validate(profile.emails[0].value)) {
        return done(`Email address is invalid or not provided.`);
      }

      const userExists = await User.findOne({ email: profile.emails[0].value });
      if (userExists) {
        return done('An account already exists for that email using a different authentication method.');
      }

      const session = await mongoose.startSession();
      session.startTransaction();
      const createdUser = await User.create({
        email: profile.emails[0].value,
        password: 'Federated1',
        credentialType: 'federated',
      });
      await FederatedCredential.create({ userId: createdUser._id, provider: 'facebook', federatedId: profile.id });
      await session.commitTransaction();
      session.endSession();
      return done(null, createdUser);
    }

    const user = await User.findById(fedCredResult);
    return done(null, user);
  } catch (err) {
    return done('There was an error verifying Facebook login credentials.');
  }
};

const facebookStrategy = new FacebookStrategy(facebookOptions, manageLogin);

module.exports = {
  facebookStrategy,
  manageLogin,
};
