// @ts-nocheck
/* eslint-disable  */

module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: 'src',
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  coverageDirectory: '../coverage',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@models': '<rootDir>/app/models',
    '^@models/(.*)$': '<rootDir>/app/models/$1',
    '^@shared/(.*)$': '<rootDir>/app/shared/$1',
  },
};
