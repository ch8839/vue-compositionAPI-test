const libDir = process.env.LIB_DIR

const transformIgnorePatterns = [
  '/dist/',
  // Ignore modules without es dir.
  // Update: @babel/runtime should also be transformed
  // 'node_modules/(?!.*(@babel|lodash-es))',
  '/es/',
  'node_modules/[^/]+?/(?!(es|node_modules)/)',
]
const testPathIgnorePatterns = ['/node_modules/', 'node']

module.exports = {
  testURL: 'http://localhost/',
  setupFiles: ['./tests/setup.js'],
  moduleFileExtensions: ['js', 'jsx', 'ts', 'tsx', 'vue', 'json'],
  modulePathIgnorePatterns: [],
  testPathIgnorePatterns: testPathIgnorePatterns,
  transform: {
    '^.+\\.(vue|md)$': '@vue/vue2-jest',
    '^.+\\.(js|jsx)$': 'babel-jest',
    '^.+\\.(ts|tsx)$': 'babel-jest',
    '^.+\\.svg$': 'jest-transform-stub',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    "@components/(.*)$": '<rootDir>/src/$1',
    "@utils/(.*)$": '<rootDir>/src/__utils__/$1',
    "@hooks/(.*)$": '<rootDir>/src/hooks/$1',
    "@tests/(.*)$": '<rootDir>/tests/$1',
  },
  snapshotSerializers: ['jest-serializer-vue'],
  collectCoverage: process.env.COVERAGE === 'true',
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx,vue}',
    '!src/*/locale/*.{js,jsx}',
    '!src/*/__tests__/**/type.{js,jsx}',
    '!src/*/demo/**/*',
    '!**/node_modules/**',
  ],
  testEnvironment: 'jest-environment-jsdom-global',
  transformIgnorePatterns,
  // testRegex: '/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  globals: {
  },
}
