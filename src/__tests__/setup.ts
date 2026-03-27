// Shared test setup for all Empire mobile apps
(globalThis as Record<string, unknown>).__DEV__ = true;

// Suppress React 19 AggregateError from act()
const originalConsoleError = console.error;
console.error = (...args: unknown[]) => {
  const msg = typeof args[0] === "string" ? args[0] : "";
  if (msg.includes("AggregateError") || msg.includes("act(...)")) return;
  originalConsoleError(...args);
};

jest.mock("expo-secure-store", () => ({
  getItemAsync: jest.fn().mockResolvedValue(null),
  setItemAsync: jest.fn().mockResolvedValue(undefined),
  deleteItemAsync: jest.fn().mockResolvedValue(undefined),
}));

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  }),
  useLocalSearchParams: () => ({ id: "1" }),
  useSegments: () => [],
  useFocusEffect: (cb: () => void) => cb(),
  Redirect: () => null,
  Link: ({ children }: { children: React.ReactNode }) => children,
  Stack: Object.assign(() => null, { Screen: () => null }),
  Tabs: Object.assign(
    ({ children }: { children: React.ReactNode }) => children,
    { Screen: () => null }
  ),
  router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
}));

jest.mock("expo-notifications", () => ({
  setNotificationHandler: jest.fn(),
  getPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  requestPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
  getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: "mock-token" }),
  setNotificationChannelAsync: jest.fn(),
  useLastNotificationResponse: () => null,
  AndroidImportance: { HIGH: 4 },
  AndroidNotificationPriority: { HIGH: "high" },
}));

jest.mock("expo-status-bar", () => ({
  StatusBar: () => null,
}));

jest.mock("react-native-safe-area-context", () => {
  const { View } = require("react-native");
  return {
    SafeAreaView: View,
    SafeAreaProvider: View,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  };
});

jest.mock("@react-native-community/netinfo", () => ({
  useNetInfo: () => ({ isConnected: true }),
}));

jest.mock("@sentry/react-native", () => ({
  init: jest.fn(),
  wrap: (c: unknown) => c,
  captureException: jest.fn(),
  addBreadcrumb: jest.fn(),
}));
