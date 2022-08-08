module.exports = {
  moduleFileExtensions: ['vue', 'js', 'json', 'ts'],
  moduleDirectories: ['node_modules'],
  rootDir: 'src',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverageFrom: ['**/*.{(t|j)s,vue}', '!**/node_modules/**'],
  coverageDirectory: '<rootDir>/../reports/coverage',
  coverageReporters: [['lcov', { projectRoot: '../' }]],
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: 'reports',
        outputName: 'test-reporter.xml',
        reportedFilePath: 'relative',
        relativeRootDir: '../',
      },
    ],
  ],
};
