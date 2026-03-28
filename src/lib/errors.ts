import { Alert } from "react-native";
import { errorReporter } from "./errorReporting";

export class NetworkError extends Error {
  constructor(message = "Network request failed. Check your connection.") {
    super(message);
    this.name = "NetworkError";
  }
}

export class SessionExpiredError extends Error {
  constructor() {
    super("Session expired. Please sign in again.");
    this.name = "SessionExpiredError";
  }
}

export function isNetworkError(err: unknown): boolean {
  if (
    err instanceof TypeError &&
    (err.message === "Network request failed" ||
      err.message === "Failed to fetch")
  ) {
    return true;
  }
  return false;
}

/**
 * Centralized error handler for screens.
 * Shows appropriate Alert based on error type and reports to Sentry
 * (or console fallback) via the shared errorReporter.
 */
export function handleError(err: unknown, context = "Error"): void {
  if (err instanceof NetworkError) {
    Alert.alert("Offline", err.message);
  } else if (err instanceof SessionExpiredError) {
    Alert.alert("Session Expired", err.message);
  } else if (err instanceof Error) {
    Alert.alert(context, err.message);
  } else {
    Alert.alert(context, "Something went wrong. Please try again.");
  }

  // Report to centralized error reporter (Sentry or console fallback)
  if (err instanceof Error) {
    errorReporter.captureException(err, { context });
  } else {
    errorReporter.captureMessage(
      `[${context}] ${String(err)}`,
      "error",
    );
  }

  if (__DEV__) {
    console.error(`[${context}]`, err);
  }
}
