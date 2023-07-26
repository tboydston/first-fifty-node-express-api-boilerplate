const mfaService = require('@services/mfa.service');

describe('Mfa service', () => {
  let secret = '';
  let decryptedSecret = {};

  describe('Encrypt and decrypt secret', () => {
    test('Secret should be the same after being encrypted and decrypted.', async () => {
      secret = await mfaService.generateEncryptedSecret();
      decryptedSecret = await mfaService.decryptSecret(secret.encryptedSecret);
      expect(secret.secret).toBe(decryptedSecret);
    });
  });
});
