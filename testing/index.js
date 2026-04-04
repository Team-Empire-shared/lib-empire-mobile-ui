"use strict";
// CommonJS wrapper for testing utilities — Jest runs in CJS mode,
// so consuming apps need this rather than the .ts ESM source.
const testing = require("./index.ts");

// Re-export everything from the TS source via CJS
if (testing.__esModule) {
  Object.assign(module.exports, testing);
} else {
  module.exports = testing;
}
