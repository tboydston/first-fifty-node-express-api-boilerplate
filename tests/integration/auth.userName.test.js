process.env.REGISTRATION_REQUIRED_FIELDS = 'firstName,lastName,userName';
process.env.LOGIN_ALLOW_USERNAME = true;
process.env.REGISTRATION_APPEND_UUID_TO_USERNAMES = false;

const request = require('supertest');
const faker = require('faker');
const httpStatus = require('http-status');
const app = require('@src/app');
const setupTestDB = require('../utils/setupTestDB');
const config = require('@config/config');
const { User } = require('@models');
const { userOneUserName, insertUsers } = require('../fixtures/user.fixture');

setupTestDB();

describe('Auth routes with userName', () => {
  describe('POST /v1/auth/register', () => {
    let newUser;
    beforeEach(() => {
      newUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
      };
    });

    test('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.CREATED);

      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user).toEqual({
        id: expect.anything(),
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        userName: newUser.userName,
        email: newUser.email,
        role: 'user',
        isEmailVerified: false,
        mfaEnabled: false,
        mfaType: 'totp',
      });

      const dbUser = await User.findById(res.body.user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);
      expect(dbUser).toMatchObject({
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        userName: newUser.userName,
        role: 'user',
        isEmailVerified: false,
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test('should return 400 error if username is invalid', async () => {
      newUser.userName = 'invalid#$$Email';

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if username is undefined', async () => {
      newUser.userName = undefined;

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });

    test('should return 400 error if userName is already used', async () => {
      await insertUsers([userOneUserName]);
      newUser.userName = userOneUserName.userName;

      await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);
    });
  });

  describe('POST /v1/auth/login', () => {
    test('should return 200 and login user if userName and password match', async () => {
      await insertUsers([userOneUserName]);
      const loginCredentials = {
        login: userOneUserName.userName,
        password: userOneUserName.password,
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.OK);

      expect(res.body.user).toEqual({
        id: expect.anything(),
        firstName: userOneUserName.firstName,
        lastName: userOneUserName.lastName,
        email: userOneUserName.email,
        userName: userOneUserName.userName,
        role: userOneUserName.role,
        isEmailVerified: userOneUserName.isEmailVerified,
        mfaEnabled: false,
        mfaType: 'totp',
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test('should return 200 and login user if email and password match', async () => {
      await insertUsers([userOneUserName]);
      const loginCredentials = {
        login: userOneUserName.email,
        password: userOneUserName.password,
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.OK);

      expect(res.body.user).toEqual({
        id: expect.anything(),
        firstName: userOneUserName.firstName,
        lastName: userOneUserName.lastName,
        email: userOneUserName.email,
        userName: userOneUserName.userName,
        role: userOneUserName.role,
        isEmailVerified: userOneUserName.isEmailVerified,
        mfaEnabled: false,
        mfaType: 'totp',
      });

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test('should return 401 error if there are no users with that userName', async () => {
      const loginCredentials = {
        login: userOneUserName.userName,
        password: userOneUserName.password,
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual(
        expect.objectContaining({
          code: httpStatus.UNAUTHORIZED,
          type: 'authInvalidUserNameOrPassword',
        })
      );
    });

    test('should return 401 error if password is wrong', async () => {
      await insertUsers([userOneUserName]);
      const loginCredentials = {
        login: userOneUserName.userName,
        password: 'wrongPassword1',
      };

      const res = await request(app).post('/v1/auth/login').send(loginCredentials).expect(httpStatus.UNAUTHORIZED);

      expect(res.body).toEqual(
        expect.objectContaining({
          code: httpStatus.UNAUTHORIZED,
          type: 'authInvalidUserNameOrPassword',
        })
      );
    });
  });
});

describe('Auth routes with userName and random uuid suffix', () => {
  describe('POST /v1/auth/register', () => {
    let newUser;

    beforeAll(() => {
      config.registration.appendUUIDtoUserNames = true;
    });

    beforeEach(() => {
      newUser = {
        firstName: faker.name.firstName(),
        lastName: faker.name.lastName(),
        userName: faker.internet.userName(),
        email: faker.internet.email().toLowerCase(),
        password: 'password1',
      };
    });

    test('should return 201 and successfully register user if request data is ok', async () => {
      const res = await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.CREATED);

      expect(res.body.user).not.toHaveProperty('password');
      expect(res.body.user.userName.split('-')[0]).toEqual(newUser.userName);
      expect(res.body.user.userName.split('-')[1].length).toEqual(8);

      const dbUser = await User.findById(res.body.user.id);
      expect(dbUser).toBeDefined();
      expect(dbUser.password).not.toBe(newUser.password);

      expect(res.body.tokens).toEqual({
        access: { token: expect.anything(), expires: expect.anything() },
        refresh: { token: expect.anything(), expires: expect.anything() },
      });
    });

    test('should return 400 because username inlcudes a "-".', async () => {
      newUser.userName = 'user-name';

      const res = await request(app).post('/v1/auth/register').send(newUser).expect(httpStatus.BAD_REQUEST);

      expect(res.body.message).toBe("userName must be between 3 and 30 characters contain only '.' and '_'");
    });
  });
});
