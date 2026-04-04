/**
 * Shared test mock factories for all Empire mobile apps.
 */

/** Mock factory map — keys match common Expo / RN module names */
export declare const mocks: {
  expoSecureStore: () => Record<string, jest.Mock>;
  expoRouter: () => Record<string, unknown>;
  expoNotifications: () => Record<string, unknown>;
  expoStatusBar: () => Record<string, unknown>;
  expoHaptics: () => Record<string, unknown>;
  safeAreaContext: () => Record<string, unknown>;
  netInfo: () => Record<string, unknown>;
  sentry: () => Record<string, unknown>;
  empireMobileUI: () => Record<string, unknown>;
};

/** Suppress common noisy console.error messages in tests */
export declare function suppressNoisyWarnings(): void;
