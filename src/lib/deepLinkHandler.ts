import { useEffect, useRef } from "react";

/**
 * Map of notification screen keys to route patterns.
 * Use `[id]` as placeholder for dynamic segments.
 *
 * Example:
 *   { "job": "/job/[id]", "applications": "/(tabs)/applications" }
 */
export type RouteMap = Record<string, string>;

export interface DeepLinkHandler {
  /**
   * Maps notification data (screen + id) to an app route string.
   * Returns the resolved route or null if no match found.
   */
  handleNotification(data: Record<string, any>): string | null;

  /**
   * Parses a deep link URL into a screen name and params.
   * Returns null if the URL does not match any route pattern.
   */
  parseUrl(url: string): { screen: string; params: Record<string, string> } | null;
}

/**
 * Create a deep link handler for an app's route map.
 *
 * Each app provides its own routeMap when initializing:
 *
 * ```ts
 * const handler = createDeepLinkHandler({
 *   "job": "/job/[id]",
 *   "applications": "/(tabs)/applications",
 *   "listing": "/listing/[id]",
 *   "bookings": "/(tabs)/bookings",
 * });
 * ```
 */
export function createDeepLinkHandler(routeMap: RouteMap): DeepLinkHandler {
  // Pre-compute regex patterns for URL parsing
  const patterns = Object.entries(routeMap).map(([screen, routePattern]) => {
    const paramNames: string[] = [];
    const regexStr = routePattern.replace(/\[(\w+)\]/g, (_match, name) => {
      paramNames.push(name);
      return "([^/]+)";
    });
    return {
      screen,
      routePattern,
      regex: new RegExp(`^${regexStr}$`),
      paramNames,
    };
  });

  return {
    handleNotification(data: Record<string, any>): string | null {
      if (!data || typeof data !== "object") return null;

      const screen = data.screen as string | undefined;
      if (!screen) return null;

      const routePattern = routeMap[screen];
      if (!routePattern) return null;

      // Replace [param] placeholders with values from data
      const route = routePattern.replace(/\[(\w+)\]/g, (_match, param) => {
        // Check data.id first (common convention), then data[param]
        const value = param === "id" ? (data.id ?? data[param]) : data[param];
        return value != null ? String(value) : "";
      });

      // If any placeholder was not resolved (empty string remained), return null
      if (route.includes("//" ) || route.endsWith("/")) {
        return null;
      }

      return route;
    },

    parseUrl(url: string): { screen: string; params: Record<string, string> } | null {
      if (!url) return null;

      // Strip scheme (e.g. "empireo-app://") and host
      let path = url;
      const schemeIndex = url.indexOf("://");
      if (schemeIndex !== -1) {
        path = url.slice(schemeIndex + 3);
        // Remove host portion if present
        const slashIndex = path.indexOf("/");
        if (slashIndex !== -1) {
          path = path.slice(slashIndex);
        } else {
          path = "/";
        }
      }

      // Ensure leading slash
      if (!path.startsWith("/")) {
        path = "/" + path;
      }

      // Remove trailing slash (except for root)
      if (path.length > 1 && path.endsWith("/")) {
        path = path.slice(0, -1);
      }

      // Remove query string
      const queryIndex = path.indexOf("?");
      if (queryIndex !== -1) {
        path = path.slice(0, queryIndex);
      }

      for (const { screen, regex, paramNames } of patterns) {
        const match = path.match(regex);
        if (match) {
          const params: Record<string, string> = {};
          paramNames.forEach((name, i) => {
            params[name] = decodeURIComponent(match[i + 1]);
          });
          return { screen, params };
        }
      }

      return null;
    },
  };
}

/**
 * Hook that auto-navigates when the user taps a push notification.
 * Handles both warm-start (app in background) and cold-start scenarios.
 *
 * Usage in _layout.tsx:
 *
 * ```tsx
 * import { useNotificationRouter, createDeepLinkHandler } from "@empireoe/mobile-ui";
 *
 * const handler = createDeepLinkHandler({
 *   "job": "/job/[id]",
 *   "applications": "/(tabs)/applications",
 * });
 *
 * export default function RootLayout() {
 *   useNotificationRouter(handler);
 *   // ...
 * }
 * ```
 */
export function useNotificationRouter(handler: DeepLinkHandler): void {
  // Lazy-require so the module works in environments where these
  // packages aren't installed (e.g. tests, web)
  let Notifications: typeof import("expo-notifications");
  let useRouter: typeof import("expo-router")["useRouter"];

  try {
    Notifications = require("expo-notifications");
    useRouter = require("expo-router").useRouter;
  } catch {
    // Dependencies not available — hook is a no-op
    return;
  }

  const router = useRouter();
  const responseListener = useRef<any>(null);

  useEffect(() => {
    function navigateFromData(data: Record<string, any> | undefined | null) {
      if (!data) return;
      const route = handler.handleNotification(data as Record<string, any>);
      if (route) {
        router.push(route as any);
      }
    }

    // Warm start: notification tapped while app is running
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        navigateFromData(
          response.notification.request.content.data as Record<string, any>,
        );
      });

    // Cold start: notification that launched the app
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        navigateFromData(
          response.notification.request.content.data as Record<string, any>,
        );
      }
    });

    return () => {
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, [handler, router]);
}
