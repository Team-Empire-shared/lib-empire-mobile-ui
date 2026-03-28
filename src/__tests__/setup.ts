// Shared test setup for @empireoe/mobile-ui
// Module mocks are handled via jest.config.js moduleNameMapper -> __mocks__/
(globalThis as Record<string, unknown>).__DEV__ = true;

// Suppress React 19 AggregateError from act()
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const msg = typeof args[0] === "string" ? args[0] : "";
  if (msg.includes("AggregateError") || msg.includes("act(...)")) return;
  if (msg.includes("react-test-renderer is deprecated")) return;
  originalConsoleError(...args);
};

// Patch Animated.timing to force useNativeDriver: false in tests
// This prevents crashes from the native animation driver not being available
try {
  const { Animated } = require("react-native");
  const originalTiming = Animated.timing;
  Animated.timing = (value: any, config: any) =>
    originalTiming(value, { ...config, useNativeDriver: false });
  const originalSpring = Animated.spring;
  Animated.spring = (value: any, config: any) =>
    originalSpring(value, { ...config, useNativeDriver: false });
} catch {
  // react-native not available
}
