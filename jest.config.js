module.exports = {
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test',
  },
  restoreMocks: true,
  coveragePathIgnorePatterns: ['node_modules', 'src/config', 'src/app.js', 'tests'],
  coverageReporters: ['text', 'lcov', 'clover', 'html'],
  moduleNameMapper: {
    "^@root(.*)$": "<rootDir>/$1",
    "^@src(.*)$": "<rootDir>/src/$1",
    "^@config(.*)$": "<rootDir>/src/config/$1",
    "^@helpers(.*)$": "<rootDir>/src/helpers/$1",
    "^@controllers(.*)$": "<rootDir>/src/controllers/$1",
    "^@docs(.*)$": "<rootDir>/src/docs/$1",
    "^@middlewares(.*)$": "<rootDir>/src/middlewares/$1",
    "^@models(.*)$": "<rootDir>/src/models/$1",
    "^@routes(.*)$": "<rootDir>/src/routes/$1",
    "^@utils(.*)$": "<rootDir>/src/utils/$1",
    "^@services(.*)$": "<rootDir>/src/services/$1",
    "^@validations(.*)$": "<rootDir>/src/validations/$1"
  },
};
