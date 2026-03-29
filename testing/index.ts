/**
 * @empireoe/mobile-ui/testing
 *
 * Shared test mock factories for all Empire mobile apps.
 * Each app's __tests__/setup.ts calls jest.mock() locally with these
 * imported factories — this avoids Jest's module resolution issue where
 * jest.mock() resolves module names relative to the calling file.
 *
 * Usage:
 *   import { mocks, suppressNoisyWarnings } from "@empireoe/mobile-ui/testing";
 *
 *   (globalThis as Record<string, unknown>).__DEV__ = true;
 *   suppressNoisyWarnings();
 *
 *   jest.mock("expo-secure-store", mocks.expoSecureStore);
 *   jest.mock("expo-router", mocks.expoRouter);
 *   jest.mock("expo-notifications", mocks.expoNotifications);
 *   jest.mock("expo-status-bar", mocks.expoStatusBar);
 *   jest.mock("expo-haptics", mocks.expoHaptics);
 *   jest.mock("react-native-safe-area-context", mocks.safeAreaContext);
 *   jest.mock("@react-native-community/netinfo", mocks.netInfo);
 *   jest.mock("@sentry/react-native", mocks.sentry);
 *   jest.mock("@empireoe/mobile-ui", mocks.empireMobileUI);
 */

// ---------------------------------------------------------------------------
// Mock factory functions (second arg to jest.mock)
// ---------------------------------------------------------------------------

export const mocks = {
  expoSecureStore: () => ({
    getItemAsync: jest.fn().mockResolvedValue(null),
    setItemAsync: jest.fn().mockResolvedValue(undefined),
    deleteItemAsync: jest.fn().mockResolvedValue(undefined),
  }),

  expoRouter: () => ({
    useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
    useLocalSearchParams: () => ({ id: "1" }),
    useSegments: () => [],
    useFocusEffect: (cb: () => void) => cb(),
    Redirect: () => null,
    Link: ({ children }: { children: unknown }) => children,
    Stack: Object.assign(() => null, { Screen: () => null }),
    Tabs: Object.assign(({ children }: { children: unknown }) => children, {
      Screen: () => null,
    }),
    router: { push: jest.fn(), replace: jest.fn(), back: jest.fn() },
  }),

  expoNotifications: () => ({
    setNotificationHandler: jest.fn(),
    getPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: "granted" }),
    getExpoPushTokenAsync: jest.fn().mockResolvedValue({ data: "mock-token" }),
    setNotificationChannelAsync: jest.fn(),
    useLastNotificationResponse: () => null,
    AndroidImportance: { HIGH: 4 },
    AndroidNotificationPriority: { HIGH: "high" },
  }),

  expoStatusBar: () => ({ StatusBar: () => null }),

  expoHaptics: () => ({
    impactAsync: jest.fn(),
    notificationAsync: jest.fn(),
    selectionAsync: jest.fn(),
    ImpactFeedbackStyle: { Light: "light", Medium: "medium", Heavy: "heavy" },
    NotificationFeedbackType: { Success: "success", Error: "error", Warning: "warning" },
  }),

  safeAreaContext: () => ({
    SafeAreaView: ({ children }: { children: unknown }) => children,
    SafeAreaProvider: ({ children }: { children: unknown }) => children,
    useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 0, left: 0 }),
  }),

  netInfo: () => ({
    useNetInfo: () => ({ isConnected: true }),
    addEventListener: jest.fn(() => jest.fn()),
    fetch: jest.fn().mockResolvedValue({ isConnected: true, isInternetReachable: true }),
  }),

  sentry: () => ({
    init: jest.fn(),
    wrap: (c: unknown) => c,
    captureException: jest.fn(),
    captureMessage: jest.fn(),
    addBreadcrumb: jest.fn(),
    setUser: jest.fn(),
    withScope: jest.fn((cb: (scope: unknown) => void) =>
      cb({ setExtras: jest.fn() }),
    ),
  }),

  empireMobileUI: () => ({
    // Components
    SkeletonCard: () => null,
    SkeletonStats: () => null,
    SkeletonDetail: () => null,
    Skeleton: () => null,
    ToastContainer: () => null,
    OfflineBanner: () => null,
    ErrorBoundary: ({ children }: { children: unknown }) => children,
    InfiniteList: () => null,
    Avatar: () => null,
    AnimatedCard: ({ children }: { children: unknown }) => children,
    AnimatedButton: ({ children }: { children: unknown }) => children,
    FadeInView: ({ children }: { children: unknown }) => children,
    CompanyLogo: () => null,
    GradientHeader: () => null,
    BottomSheet: () => null,
    SwipeableRow: () => null,
    FAB: () => null,
    StalenessBadge: () => null,
    EmptyState: () => null,
    OnboardingChecklist: () => null,
    ProfileCompleteness: () => null,
    FormTextInput: () => null,
    FormSelect: () => null,
    CachedImage: () => null,
    PremiumLoginScreen: () => null,

    // Toast
    toast: { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() },
    useToastStore: () => ({ toasts: [] }),

    // Error reporting
    errorReporter: {
      init: jest.fn(),
      captureException: jest.fn(),
      captureMessage: jest.fn(),
      setUser: jest.fn(),
      addBreadcrumb: jest.fn(),
    },

    // Theme tokens
    colors: {},
    premiumDark: {},
    premiumTabBarOptions: {},
    productColors: {
      eoe: "#2563eb",
      empireDigital: "#6366f1",
      lwe: "#059669",
      egpn: "#d97706",
      afterServices: "#0891b2",
      codnov: "#7c3aed",
      recruitment: "#dc2626",
      empireo: "#1e40af",
    },
    spacing: {},
    radius: {},
    fontSizes: {},
    fontWeights: {},
    typography: {},
    commonStyles: {},

    // Haptics (no-ops)
    tapLight: jest.fn(),
    tapMedium: jest.fn(),
    tapHeavy: jest.fn(),
    notifySuccess: jest.fn(),
    notifyError: jest.fn(),
    notifyWarning: jest.fn(),
    selectionTick: jest.fn(),

    // Analytics
    analytics: {
      init: jest.fn(),
      track: jest.fn(),
      screen: jest.fn(),
      identify: jest.fn(),
      reset: jest.fn(),
    },

    // Hooks
    useInfiniteList: () => ({
      data: [],
      isLoading: false,
      isRefreshing: false,
      hasMore: false,
      loadMore: jest.fn(),
      refresh: jest.fn(),
    }),
    useSWR: () => ({
      data: undefined,
      error: undefined,
      isLoading: false,
      mutate: jest.fn(),
    }),
    useAppUpdate: () => ({ status: "idle", checkNow: jest.fn() }),
    usePushNotifications: () => ({
      token: null,
      permission: "undetermined",
      requestPermission: jest.fn(),
    }),
    usePermission: () => ({
      status: "granted",
      request: jest.fn(),
      openSettings: jest.fn(),
    }),
    useCamera: () => ({ takePhoto: jest.fn(), hasPermission: true }),
    usePhotos: () => ({ pickImage: jest.fn(), hasPermission: true }),

    // Deep link
    createDeepLinkHandler: jest.fn(() => ({
      handle: jest.fn(),
      getInitialURL: jest.fn(),
    })),
    useNotificationRouter: jest.fn(),

    // Storage / cache / offline
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    deleteItem: jest.fn().mockResolvedValue(undefined),
    getCached: jest.fn().mockResolvedValue(null),
    setCached: jest.fn().mockResolvedValue(undefined),
    clearCache: jest.fn().mockResolvedValue(undefined),
    timeAgo: jest.fn(() => "just now"),
    enqueueAction: jest.fn(),
    dequeueAction: jest.fn(),
    clearQueue: jest.fn(),
    getQueueCount: jest.fn().mockResolvedValue(0),
    getQueuedActions: jest.fn().mockResolvedValue([]),
    flushQueue: jest.fn(),
    startSyncListener: jest.fn(),
    setOnSyncComplete: jest.fn(),
    setActionProcessor: jest.fn(),

    // Biometric
    isBiometricAvailable: jest.fn().mockResolvedValue(false),
    authenticateWithBiometric: jest.fn().mockResolvedValue(true),
    startAppStateListener: jest.fn(),
    setLockChangeListener: jest.fn(),
    isLocked: jest.fn(() => false),

    // WebSocket
    EmpireWebSocket: jest.fn(),

    // API client factory
    createApiClient: jest.fn((_opts?: unknown) => ({
      api: {
        get: jest.fn().mockResolvedValue({ data: {} }),
        post: jest.fn().mockResolvedValue({ data: {} }),
        put: jest.fn().mockResolvedValue({ data: {} }),
        patch: jest.fn().mockResolvedValue({ data: {} }),
        delete: jest.fn().mockResolvedValue({ data: {} }),
        interceptors: {
          request: { use: jest.fn() },
          response: { use: jest.fn() },
        },
        defaults: { headers: { common: {} } },
      },
      setOnUnauthorized: jest.fn(),
    })),

    // Errors
    NetworkError: class extends Error {},
    SessionExpiredError: class extends Error {},
    isNetworkError: jest.fn(() => false),
    handleError: jest.fn(),

    // Misc
    checkForUpdate: jest.fn(),
    fetchAndApplyUpdate: jest.fn(),
    requestPermission: jest.fn(),
    checkPermission: jest.fn(),
    showSettingsAlert: jest.fn(),
  }),
};

// ---------------------------------------------------------------------------
// Console error filter (suppress noisy RN test warnings)
// ---------------------------------------------------------------------------

/** Suppress common noisy console.error messages in tests (AggregateError, act warnings) */
export function suppressNoisyWarnings() {
  const originalConsoleError = console.error;
  console.error = (...args: unknown[]) => {
    const msg = typeof args[0] === "string" ? args[0] : "";
    if (msg.includes("AggregateError") || msg.includes("act(...)")) return;
    originalConsoleError(...args);
  };
}
