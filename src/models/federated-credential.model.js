const mongoose = require('mongoose');
const { toJSON } = require('./plugins');

const federatedCredentialsSchema = mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    provider: {
      type: String,
      required: true,
    },
    federatedId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
federatedCredentialsSchema.plugin(toJSON);

/**
 * Check if credential exists
 * @param {string} provider - Name of federated ID provider.
 * @param {string} federatedId - Unique ID provided for the user by federated provider.
 * @returns {Promise<boolean>}
 */
federatedCredentialsSchema.statics.federatedCredentialExists = async function (provider, federatedId) {
  const credential = await this.findOne({ provider, federatedId });
  return !!credential;
};

/**
 * @typedef FederatedCredential
 */
const FederatedCredential = mongoose.model('FederatedCredential', federatedCredentialsSchema);

module.exports = FederatedCredential;
