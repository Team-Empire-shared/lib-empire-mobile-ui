import { Alert } from "react-native";

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
 * Shows appropriate Alert based on error type.
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

  if (__DEV__) {
    console.error(`[${context}]`, err);
  }
}
