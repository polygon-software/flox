module.exports = {
  moduleFileExtensions: ['vue', 'js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.{(t|j)s,vue}', '!**/node_modules/**'],
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  testResultsProcessor: 'jest-sonar-reporter',
};
