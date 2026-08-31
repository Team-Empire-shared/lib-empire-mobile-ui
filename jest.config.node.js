// Pure-logic lib tests, node environment, no React Native renderer.
//
// jest.config.js (the React Native one) cannot currently run: it pulls
// @testing-library/react-native/jest-preset, which requires react-native/jest-preset
// — moved to the separate @react-native/jest-preset package, which is not a
// dependency here. That breakage predates this config and is why package.json's
// `test` script is a stub. Rather than add a dependency, this config uses the
// repo's own jest.config.base createConfig() escape hatch so the logic-only
// modules under src/lib are testable today.
const { createConfig } = require("./jest.config.base");

const mockDir = "<rootDir>/src/__tests__/__mocks__";

module.exports = createConfig({
  setupFiles: [],
  moduleNameMapper: {
    "^react-native$": `${mockDir}/react-native.ts`,
    "^expo-secure-store$": `${mockDir}/expo-secure-store.ts`,
    "^expo-local-authentication$": `${mockDir}/expo-local-authentication.ts`,
  },
  testMatch: ["<rootDir>/src/__tests__/lib/biometric.test.ts"],
});
