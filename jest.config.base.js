// Base Jest config — import in each app's jest.config.js
const sharedTransform = {
  "^.+\\.[jt]sx?$": [
    "babel-jest",
    { presets: ["babel-preset-expo"] },
  ],
};

const sharedTransformIgnore = [
  "node_modules/(?!((jest-)?react-native|@react-native(-community)?|expo(nent)?|@expo(nent)?/.*|react-navigation|@react-navigation/.*|react-native-svg|react-native-safe-area-context|nativewind|react-native-css-interop|zustand|react-hook-form|@hookform|axios|zod)/)",
];

module.exports = {
  sharedTransform,
  sharedTransformIgnore,
  createConfig: (opts = {}) => ({
    testEnvironment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    transform: sharedTransform,
    transformIgnorePatterns: sharedTransformIgnore,
    moduleNameMapper: {
      "^@/(.*)$": "<rootDir>/src/$1",
      ...opts.moduleNameMapper,
    },
    testMatch: [
      "<rootDir>/src/__tests__/**/*.test.{ts,tsx}",
    ],
    collectCoverageFrom: [
      "src/**/*.{ts,tsx}",
      "!src/**/*.d.ts",
      "!src/__tests__/**",
    ],
    ...opts,
  }),
};
