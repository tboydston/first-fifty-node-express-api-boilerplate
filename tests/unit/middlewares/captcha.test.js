const axios = require('axios');
const httpStatus = require('http-status');
const captcha = require('@middlewares/captcha');

jest.mock('axios');

const config = {
  captcha: {
    enabled: true,
    provider: 'reCaptchaV2',
    secret: '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
    scoreThresholds: {
      default: 0.5,
      overrides: {
        '/test': 0.9,
      },
    },
  },
};

describe('Captcha middlewares', () => {
  describe('verify captcha', () => {
    afterEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
    });
    test('should verify successfully and not throw exception.', async () => {
      const next = jest.fn();
      Object.assign(captcha.config.captcha, config.captcha);
      const req = {
        header: () => {
          return 'testAuthResponse';
        },
      };
      const axiosResponse = {
        data: {
          success: true,
        },
      };
      axios.post.mockResolvedValueOnce(axiosResponse);
      await captcha.verify(req, {}, next);
      expect(next).toHaveBeenCalledWith();
    });
    test('should return true, skipping function when captcha is disabled in setting.', async () => {
      const next = jest.fn();
      Object.assign(captcha.config.captcha, config.captcha);
      captcha.config.captcha.enabled = false;
      const req = {
        header: () => {
          return 'testAuthResponse';
        },
      };
      const axiosResponse = {
        data: {
          success: false,
        },
      };
      await axios.post.mockResolvedValueOnce(axiosResponse);
      await captcha.verify(req, {}, next);
      expect(next).toHaveBeenCalledWith();
    });
    test('should return exception when captcha api returns captcha fail response.', async () => {
      Object.assign(captcha.config.captcha, config.captcha);

      const next = jest.fn();
      const req = {
        header: () => {
          return 'testAuthResponse';
        },
      };
      const axiosResponse = {
        data: {
          success: false,
        },
      };
      await axios.post.mockResolvedValueOnce(axiosResponse);
      await captcha.verify(req, {}, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, name: 'captchaInvalid' })
      );
    });
    test('should return true when result returns score, reCaptchaV3 is set, and score is above threshold.', async () => {
      Object.assign(captcha.config.captcha, config.captcha);
      captcha.config.captcha.provider = 'reCaptchaV3';
      const next = jest.fn();
      const req = {
        header: () => {
          return 'testAuthResponse';
        },
      };
      const axiosResponse = {
        data: {
          success: true,
          score: 0.6,
        },
      };
      await axios.post.mockResolvedValueOnce(axiosResponse);
      await captcha.verify(req, {}, next);
      expect(next).toHaveBeenCalledWith();
    });
    test('should return exceptions when result returns score, reCaptchaV3 is set, and score is below threshold.', async () => {
      Object.assign(captcha.config.captcha, config.captcha);
      captcha.config.captcha.provider = 'reCaptchaV3';
      const next = jest.fn();
      const req = {
        header: () => {
          return 'testAuthResponse';
        },
      };
      const axiosResponse = {
        data: {
          success: true,
          score: 0.4,
        },
      };
      await axios.post.mockResolvedValueOnce(axiosResponse);
      await captcha.verify(req, {}, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, name: 'captchaInvalid' })
      );
    });
    test('should return true when result returns score, hCaptcha is set, and score is above threshold.', async () => {
      Object.assign(captcha.config.captcha, config.captcha);
      captcha.config.captcha.provider = 'hCaptcha';
      const next = jest.fn();
      const req = {
        header: () => {
          return 'testAuthResponse';
        },
      };
      const axiosResponse = {
        data: {
          success: true,
          score: 0.4,
        },
      };
      await axios.post.mockResolvedValueOnce(axiosResponse);
      await captcha.verify(req, {}, next);
      expect(next).toHaveBeenCalledWith();
    });
    test('should return exceptions when result returns score, hCaptcha is set, and score is below threshold.', async () => {
      Object.assign(captcha.config.captcha, config.captcha);
      captcha.config.captcha.provider = 'hCaptcha';
      const next = jest.fn();
      const req = {
        header: () => {
          return 'testAuthResponse';
        },
      };
      const axiosResponse = {
        data: {
          success: true,
          score: 0.6,
        },
      };
      await axios.post.mockResolvedValueOnce(axiosResponse);
      await captcha.verify(req, {}, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, name: 'captchaInvalid' })
      );
    });
    test('should return exception when score override is used for a specific path and returned score value is less than override value.', async () => {
      Object.assign(captcha.config.captcha, config.captcha);
      captcha.config.captcha.provider = 'reCaptchaV3';
      captcha.config.captcha.scoreThresholds.overrides = { '/test': 0.9 };
      const next = jest.fn();
      const req = {
        header: () => {
          return 'testAuthResponse';
        },
        originalUrl: '/test',
      };
      const axiosResponse = {
        data: {
          success: true,
          score: 0.8,
        },
      };
      await axios.post.mockResolvedValueOnce(axiosResponse);
      await captcha.verify(req, {}, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, name: 'captchaInvalid' })
      );
    });
    test('should return exception when env is prod but test key us used.', async () => {
      Object.assign(captcha.config.captcha, config.captcha);
      captcha.config.env = 'production';

      const next = jest.fn();
      const req = {
        header: () => {
          return 'testAuthResponse';
        },
        originalUrl: '/test',
      };
      const axiosResponse = {
        data: {
          success: true,
        },
      };
      await axios.post.mockResolvedValueOnce(axiosResponse);
      await captcha.verify(req, {}, next);
      expect(next).toHaveBeenCalledWith(
        expect.objectContaining({ statusCode: httpStatus.UNAUTHORIZED, name: 'captchaInvalid' })
      );
    });
  });
});
