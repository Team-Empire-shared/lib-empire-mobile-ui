const { sharedTransform, sharedTransformIgnore } = require("./jest.config.base");

const mockDir = "<rootDir>/src/__tests__/__mocks__";

module.exports = {
  preset: "react-native",
  setupFiles: [
    require.resolve("react-native/jest/setup.js"),
    "./src/__tests__/setup.ts",
  ],
  transform: sharedTransform,
  transformIgnorePatterns: sharedTransformIgnore,
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
    "^expo-image$": `${mockDir}/expo-image.ts`,
    "^expo-haptics$": `${mockDir}/expo-haptics.ts`,
    "^expo-updates$": `${mockDir}/expo-updates.ts`,
    "^expo-camera$": `${mockDir}/expo-camera.ts`,
    "^expo-location$": `${mockDir}/expo-location.ts`,
    "^expo-image-picker$": `${mockDir}/expo-image-picker.ts`,
    "^expo-notifications$": `${mockDir}/expo-notifications.ts`,
    "^expo-secure-store$": `${mockDir}/expo-secure-store.ts`,
    "^expo-local-authentication$": `${mockDir}/expo-local-authentication.ts`,
    "^expo-router$": `${mockDir}/expo-router.ts`,
    "^expo-status-bar$": `${mockDir}/expo-status-bar.ts`,
    "^@sentry/react-native$": `${mockDir}/@sentry/react-native.ts`,
    "^react-native-safe-area-context$": `${mockDir}/react-native-safe-area-context.ts`,
    "^@react-native-community/netinfo$": `${mockDir}/@react-native-community/netinfo.ts`,
    "^@react-native-async-storage/async-storage$": `${mockDir}/@react-native-async-storage/async-storage.ts`,
  },
  testMatch: ["<rootDir>/src/__tests__/**/*.test.{ts,tsx}"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/__tests__/**",
  ],
};
