const passportFacebook = require('../../../src/config/passport-facebook');
const setupTestDB = require('../../utils/setupTestDB');
const { User, FederatedCredential } = require('../../../src/models');
const { insertUsers, genRandomUsers } = require('../../fixtures/user.fixture');

setupTestDB();

describe('Passport Facebook Config', () => {
  describe('Manage Login', () => {
    test('should create a new users and federated credential', async () => {
      const profile = {
        id: 'testid1',
        emails: [{ value: 'testemail1@gmail.com' }],
      };
      await passportFacebook.manageLogin(null, null, profile, (err, user) => {
        return { err, user };
      });

      const profileEmail = profile.emails[0].value;

      const fedCredResult = await FederatedCredential.findOne({ federatedId: profile.id });
      const userResult = await User.findOne({ email: profileEmail });

      expect(fedCredResult.userId).toEqual(userResult.id);
      expect(userResult.email).toEqual(profileEmail);
      expect(userResult.credentialType).toEqual('federated');
    });
    test('should return an error because the email already exists.', async () => {
      const ranUser = await genRandomUsers(1);
      ranUser[0].email = 'testemail2@gmail.com';
      await insertUsers(ranUser);

      const profile = {
        id: 'testid2',
        emails: [{ value: 'testemail2@gmail.com' }],
      };
      const result = await passportFacebook.manageLogin(null, null, profile, (err, user) => {
        return { err, user };
      });

      expect(result.err).toEqual('An account already exists for that email using a different authentication method.');
    });

    test('should return email address is not valid error.', async () => {
      const profile = {
        id: 'testid3',
        emails: [],
      };
      const result = await passportFacebook.manageLogin(null, null, profile, (err, user) => {
        return { err, user };
      });

      expect(result.err).toEqual(`Email address is invalid or not provided.`);
    });
  });
});
