const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { roles } = require('@config/roles');
const config = require('@config/config');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: config.registration.requiredFields.includes('firstName'),
      trim: true,
    },
    middleName: {
      type: String,
      required: false,
      trim: true,
    },
    lastName: {
      type: String,
      required: config.registration.requiredFields.includes('lastName'),
      trim: true,
    },
    company: {
      type: String,
      required: config.registration.requiredFields.includes('company'),
      trim: true,
    },
    userName: {
      type: String,
      required: config.registration.requiredFields.includes('userName'),
      unique: true,
      sparse: true,
      trim: true,
      validate(value) {
        // Validation is different at the model level than at the API level because a UUID suffix of nine characters needs to be accommodated.
        if (value.length < 3 || value.length > 39 || !value.match(/^[a-zA-Z0-9_.-]+$/)) {
          throw new Error(`userName must be between 3 and 30 characters contain only '.' and '_'`);
        }
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: String,
      enum: roles,
      default: 'user',
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    mfaEnabled: {
      type: Boolean,
      default: false,
    },
    mfaType: {
      type: String,
      enum: ['totp'],
      default: 'totp',
    },
    mfaSecret: {
      type: String,
      required: false,
      private: true,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if userName is taken
 * @param {string} userNames - The user's userName
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isUserNameTaken = async function (userName, excludeUserId) {
  const user = await this.findOne({ userName, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
