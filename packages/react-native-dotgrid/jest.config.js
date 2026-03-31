/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true
      }
    }]
  },
  moduleNameMapper: {
    '^@shopify/react-native-skia$': '<rootDir>/test-utils/skia-mock.js',
    '^react-native$': '<rootDir>/test-utils/react-native-mock.js',
    '^react-native-reanimated$': '<rootDir>/test-utils/reanimated-mock.js',
    '^react-native-worklets$': '<rootDir>/test-utils/worklets-mock.js',
    '^react-native-svg$': '<rootDir>/test-utils/svg-mock.js'
  }
};
