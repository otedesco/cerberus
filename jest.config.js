module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}'],
  coverageReporters: ['text', 'json', 'json-summary', 'lcov', 'cobertura'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
};
