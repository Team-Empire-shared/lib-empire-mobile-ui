/**
 * Centralized error reporting abstraction.
 *
 * Tries to use @sentry/react-native when available; otherwise falls back to
 * console logging. In __DEV__ mode every call also logs to the console.
 */

type SeverityLevel = "info" | "warning" | "error";

export interface ErrorReporter {
  init(dsn: string, options?: { environment?: string; tracesSampleRate?: number }): void;
  captureException(error: Error, context?: Record<string, any>): void;
  captureMessage(message: string, level?: SeverityLevel): void;
  setUser(user: { id: string; email?: string; role?: string } | null): void;
  addBreadcrumb(message: string, category?: string, data?: Record<string, any>): void;
}

// ---------------------------------------------------------------------------
// Sentry resolution — done once, lazily
// ---------------------------------------------------------------------------

let _sentry: any | null = null;
let _sentryResolved = false;

function getSentry(): any | null {
  if (_sentryResolved) return _sentry;
  _sentryResolved = true;
  try {
    // Dynamic require so the lib works even when Sentry is not installed
    _sentry = require("@sentry/react-native");
  } catch {
    _sentry = null;
  }
  return _sentry;
}

// ---------------------------------------------------------------------------
// Console fallback helpers
// ---------------------------------------------------------------------------

function consoleForLevel(level: SeverityLevel) {
  switch (level) {
    case "info":
      return console.info;
    case "warning":
      return console.warn;
    case "error":
      return console.error;
  }
}

// ---------------------------------------------------------------------------
// Reporter implementation
// ---------------------------------------------------------------------------

function init(
  dsn: string,
  options?: { environment?: string; tracesSampleRate?: number },
): void {
  const Sentry = getSentry();
  if (Sentry) {
    Sentry.init({
      dsn,
      environment: options?.environment ?? (__DEV__ ? "development" : "production"),
      tracesSampleRate: options?.tracesSampleRate ?? 0.2,
      debug: __DEV__,
    });
  } else if (__DEV__) {
    console.warn(
      "[ErrorReporting] @sentry/react-native not installed — using console fallback",
    );
  }
}

function captureException(error: Error, context?: Record<string, any>): void {
  if (__DEV__) {
    console.error("[ErrorReporting] captureException:", error, context);
  }

  const Sentry = getSentry();
  if (Sentry) {
    if (context) {
      Sentry.withScope((scope: any) => {
        scope.setExtras(context);
        Sentry.captureException(error);
      });
    } else {
      Sentry.captureException(error);
    }
  }
}

function captureMessage(message: string, level: SeverityLevel = "info"): void {
  if (__DEV__) {
    consoleForLevel(level)(`[ErrorReporting] ${message}`);
  }

  const Sentry = getSentry();
  if (Sentry) {
    Sentry.captureMessage(message, level);
  }
}

function setUser(user: { id: string; email?: string; role?: string } | null): void {
  if (__DEV__) {
    console.info("[ErrorReporting] setUser:", user);
  }

  const Sentry = getSentry();
  if (Sentry) {
    Sentry.setUser(user);
  }
}

function addBreadcrumb(
  message: string,
  category?: string,
  data?: Record<string, any>,
): void {
  if (__DEV__) {
    console.debug("[ErrorReporting] breadcrumb:", category ?? "default", message, data);
  }

  const Sentry = getSentry();
  if (Sentry) {
    Sentry.addBreadcrumb({
      message,
      category: category ?? "default",
      data,
      level: "info",
    });
  }
}

// ---------------------------------------------------------------------------
// Singleton export
// ---------------------------------------------------------------------------

export const errorReporter: ErrorReporter = {
  init,
  captureException,
  captureMessage,
  setUser,
  addBreadcrumb,
};

export default errorReporter;
