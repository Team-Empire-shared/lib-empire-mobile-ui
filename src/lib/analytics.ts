type EventProperties = Record<string, string | number | boolean | undefined>;

// ---------------------------------------------------------------------------
// Provider interface — every analytics backend implements this contract.
// ---------------------------------------------------------------------------
interface AnalyticsProvider {
  init(): Promise<void>;
  track(event: string, properties?: EventProperties): void;
  screen(name: string, properties?: EventProperties): void;
  identify(userId: string, traits?: EventProperties): void;
  reset(): void;
}

// ---------------------------------------------------------------------------
// Console-only provider (dev or when no provider is configured)
// ---------------------------------------------------------------------------
const consoleProvider: AnalyticsProvider = {
  async init() {
    if (__DEV__) console.log("[Analytics] Console provider active");
  },
  track(event, properties) {
    if (__DEV__) console.log(`[Analytics] track: ${event}`, properties);
  },
  screen(name, properties) {
    if (__DEV__) console.log(`[Analytics] screen: ${name}`, properties);
  },
  identify(userId, traits) {
    if (__DEV__) console.log(`[Analytics] identify: ${userId}`, traits);
  },
  reset() {
    if (__DEV__) console.log("[Analytics] reset");
  },
};

// ---------------------------------------------------------------------------
// Mixpanel provider (lazy-loaded)
// ---------------------------------------------------------------------------
function createMixpanelProvider(): AnalyticsProvider {
  let mixpanel: any = null;

  return {
    async init() {
      try {
        const { Mixpanel } = require("mixpanel-react-native");
        const token = process.env.EXPO_PUBLIC_MIXPANEL_TOKEN;
        if (!token) return;
        mixpanel = new Mixpanel(token, true);
        await mixpanel.init();
      } catch {
        // Package not installed — silent fallback
      }
    },
    track(event, properties) {
      mixpanel?.track(event, properties);
    },
    screen(name, properties) {
      mixpanel?.track("Screen View", { screen_name: name, ...properties });
    },
    identify(userId, traits) {
      mixpanel?.identify(userId);
      if (traits) mixpanel?.getPeople()?.set(traits);
    },
    reset() {
      mixpanel?.reset();
    },
  };
}

// ---------------------------------------------------------------------------
// PostHog provider (lazy-loaded)
// ---------------------------------------------------------------------------
function createPostHogProvider(): AnalyticsProvider {
  let posthog: any = null;

  return {
    async init() {
      try {
        const { PostHog } = require("posthog-react-native");
        const apiKey = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
        const host = process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";
        if (!apiKey) return;
        posthog = new PostHog(apiKey, { host });
      } catch {
        // Package not installed — silent fallback
      }
    },
    track(event, properties) {
      posthog?.capture(event, properties);
    },
    screen(name, properties) {
      posthog?.screen(name, properties);
    },
    identify(userId, traits) {
      posthog?.identify(userId, traits);
    },
    reset() {
      posthog?.reset();
    },
  };
}

// ---------------------------------------------------------------------------
// Provider selection: EXPO_PUBLIC_ANALYTICS_PROVIDER = mixpanel | posthog | console
// ---------------------------------------------------------------------------
function resolveProvider(): AnalyticsProvider {
  const name = process.env.EXPO_PUBLIC_ANALYTICS_PROVIDER ?? "console";
  switch (name) {
    case "mixpanel":
      return createMixpanelProvider();
    case "posthog":
      return createPostHogProvider();
    default:
      return consoleProvider;
  }
}

const provider = resolveProvider();
let _initPromise: Promise<void> | null = null;

// ---------------------------------------------------------------------------
// Public API — import this in any screen or service
// ---------------------------------------------------------------------------
const analytics = {
  /** Initialize the analytics provider. Call once at app startup. */
  async init() {
    if (!_initPromise) _initPromise = provider.init();
    return _initPromise;
  },

  /** Track a custom event */
  track(event: string, properties?: EventProperties) {
    provider.track(event, properties);
  },

  /** Track a screen view */
  screen(name: string, properties?: EventProperties) {
    provider.screen(name, properties);
  },

  /** Identify user after login */
  identify(userId: number | string, traits?: EventProperties) {
    provider.identify(String(userId), traits);
  },

  /** Reset on logout */
  reset() {
    provider.reset();
  },
};

export type { EventProperties, AnalyticsProvider };
export default analytics;
