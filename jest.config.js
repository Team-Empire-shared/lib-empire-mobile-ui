const { sharedTransform, sharedTransformIgnore } = require("./jest.config.base");

module.exports = {
  testEnvironment: "node",
  setupFiles: ["./src/__tests__/setup.ts"],
  transform: sharedTransform,
  transformIgnorePatterns: sharedTransformIgnore,
  moduleNameMapper: { "^@/(.*)$": "<rootDir>/src/$1" },
  testMatch: ["<rootDir>/src/__tests__/**/*.test.{ts,tsx}"],
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.d.ts",
    "!src/__tests__/**",
  ],
};
