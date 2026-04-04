import { useCallback, useEffect, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

/**
 * Unified permission request system for all Empire mobile apps.
 *
 * All expo-* imports are lazy-loaded so apps that don't need a specific
 * permission module don't need to install it.
 *
 * Usage:
 * ```tsx
 * const { status, request, loading } = usePermission("camera");
 *
 * // Or imperative:
 * const result = await requestPermission("camera");
 * if (!result.granted && !result.canAskAgain) showSettingsAlert("camera");
 * ```
 */

export type PermissionType = "camera" | "photos" | "location" | "notifications";

export interface PermissionResult {
  granted: boolean;
  canAskAgain: boolean;
}

const DENIED: PermissionResult = { granted: false, canAskAgain: false };

// ── Lazy module loaders ─────────────────────────────────────────────────

async function getCameraModule(): Promise<typeof import("expo-camera") | null> {
  try {
    return await import("expo-camera");
  } catch {
    console.warn(
      "[@empireoe/mobile-ui] expo-camera is not installed. Camera permissions will not work.",
    );
    return null;
  }
}

async function getImagePickerModule(): Promise<typeof import("expo-image-picker") | null> {
  try {
    return await import("expo-image-picker");
  } catch {
    console.warn(
      "[@empireoe/mobile-ui] expo-image-picker is not installed. Photo permissions will not work.",
    );
    return null;
  }
}

async function getLocationModule(): Promise<typeof import("expo-location") | null> {
  try {
    return await import("expo-location");
  } catch {
    console.warn(
      "[@empireoe/mobile-ui] expo-location is not installed. Location permissions will not work.",
    );
    return null;
  }
}

async function getNotificationsModule(): Promise<typeof import("expo-notifications") | null> {
  try {
    return await import("expo-notifications");
  } catch {
    console.warn(
      "[@empireoe/mobile-ui] expo-notifications is not installed. Notification permissions will not work.",
    );
    return null;
  }
}

// ── Core functions ──────────────────────────────────────────────────────

/**
 * Request a specific permission. Returns whether it was granted and
 * whether the OS will allow asking again.
 */
export async function requestPermission(
  type: PermissionType,
): Promise<PermissionResult> {
  switch (type) {
    case "camera": {
      const mod = await getCameraModule();
      if (!mod) return DENIED;
      const result = await mod.Camera.requestCameraPermissionsAsync();
      return {
        granted: result.granted,
        canAskAgain: result.canAskAgain,
      };
    }

    case "photos": {
      const ImagePicker = await getImagePickerModule();
      if (!ImagePicker) return DENIED;
      const result = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return {
        granted: result.granted,
        canAskAgain: result.canAskAgain,
      };
    }

    case "location": {
      const Location = await getLocationModule();
      if (!Location) return DENIED;
      const result = await Location.requestForegroundPermissionsAsync();
      return {
        granted: result.granted,
        canAskAgain: result.canAskAgain,
      };
    }

    case "notifications": {
      const Notifications = await getNotificationsModule();
      if (!Notifications) return DENIED;
      const { status: existing } = await Notifications.getPermissionsAsync();
      if (existing === "granted") {
        return { granted: true, canAskAgain: true };
      }
      const { status, canAskAgain } =
        await Notifications.requestPermissionsAsync();
      return { granted: status === "granted", canAskAgain };
    }
  }
}

/**
 * Check the current permission status without prompting the user.
 */
export async function checkPermission(
  type: PermissionType,
): Promise<PermissionResult> {
  switch (type) {
    case "camera": {
      const mod = await getCameraModule();
      if (!mod) return DENIED;
      const result = await mod.Camera.getCameraPermissionsAsync();
      return {
        granted: result.granted,
        canAskAgain: result.canAskAgain,
      };
    }

    case "photos": {
      const ImagePicker = await getImagePickerModule();
      if (!ImagePicker) return DENIED;
      const result = await ImagePicker.getMediaLibraryPermissionsAsync();
      return {
        granted: result.granted,
        canAskAgain: result.canAskAgain,
      };
    }

    case "location": {
      const Location = await getLocationModule();
      if (!Location) return DENIED;
      const result = await Location.getForegroundPermissionsAsync();
      return {
        granted: result.granted,
        canAskAgain: result.canAskAgain,
      };
    }

    case "notifications": {
      const Notifications = await getNotificationsModule();
      if (!Notifications) return DENIED;
      const { status, canAskAgain } =
        await Notifications.getPermissionsAsync();
      return { granted: status === "granted", canAskAgain };
    }
  }
}

// ── Settings alert ──────────────────────────────────────────────────────

const PERMISSION_LABELS: Record<PermissionType, string> = {
  camera: "Camera",
  photos: "Photos",
  location: "Location",
  notifications: "Notifications",
};

/**
 * Show an alert directing the user to open Settings when `canAskAgain`
 * is false. On iOS/Android this opens the app's settings page.
 */
export function showSettingsAlert(type: PermissionType): void {
  const label = PERMISSION_LABELS[type];
  Alert.alert(
    `${label} Permission Required`,
    `Please enable ${label.toLowerCase()} access in your device settings to use this feature.`,
    [
      { text: "Cancel", style: "cancel" },
      {
        text: "Open Settings",
        onPress: () => {
          if (Platform.OS === "ios") {
            Linking.openURL("app-settings:");
          } else {
            Linking.openSettings();
          }
        },
      },
    ],
  );
}

// ── React hook ──────────────────────────────────────────────────────────

export interface UsePermissionReturn {
  /** Current permission status, null until first check completes. */
  status: PermissionResult | null;
  /** Request the permission (shows OS prompt if possible, settings alert otherwise). */
  request: () => Promise<void>;
  /** True while the initial check is in progress. */
  loading: boolean;
}

/**
 * React hook that checks a permission on mount and provides a `request`
 * function. If the user has permanently denied the permission, `request`
 * will show a "Go to Settings" alert instead.
 */
export function usePermission(type: PermissionType): UsePermissionReturn {
  const [status, setStatus] = useState<PermissionResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    checkPermission(type).then((result) => {
      if (mounted) {
        setStatus(result);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [type]);

  const request = useCallback(async () => {
    const result = await requestPermission(type);
    setStatus(result);
    if (!result.granted && !result.canAskAgain) {
      showSettingsAlert(type);
    }
  }, [type]);

  return { status, request, loading };
}
