import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";

/**
 * Shared push notification hook for all Empire mobile apps.
 *
 * Usage:
 * ```tsx
 * const { expoPushToken, notification } = usePushNotifications({
 *   onNotificationTap: (data) => {
 *     if (data?.screen === "job") router.push(`/job/${data.id}`);
 *   },
 * });
 * ```
 *
 * Requires `expo-notifications` as a peer dependency in the consuming app.
 */

export interface PushNotificationOptions {
  /** Called when user taps a notification. Receives the notification data payload. */
  onNotificationTap?: (data: Record<string, unknown>) => void;
  /** Android notification channel name. Default: "Default" */
  channelName?: string;
  /** Whether to auto-request permissions on mount. Default: true */
  autoRequest?: boolean;
}

export interface PushNotificationResult {
  /** The Expo push token string, or null if not yet obtained / denied. */
  expoPushToken: string | null;
  /** The most recent notification received while app is foregrounded. */
  notification: unknown | null;
  /** Manually request permissions + token. */
  requestPermissions: () => Promise<string | null>;
}

export function usePushNotifications(
  options: PushNotificationOptions = {},
): PushNotificationResult {
  const {
    onNotificationTap,
    channelName = "Default",
    autoRequest = true,
  } = options;

  const [expoPushToken, setExpoPushToken] = useState<string | null>(null);
  const [notification, setNotification] = useState<unknown | null>(null);
  const notificationsRef = useRef<typeof import("expo-notifications") | null>(null);

  // Lazy-load expo-notifications so the shared lib doesn't hard-depend on it
  const getNotifications = async () => {
    if (!notificationsRef.current) {
      try {
        notificationsRef.current = await import("expo-notifications");
      } catch {
        return null;
      }
    }
    return notificationsRef.current;
  };

  const requestPermissions = async (): Promise<string | null> => {
    const Notifications = await getNotifications();
    if (!Notifications) return null;

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") return null;

    // Android channel
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: channelName,
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
      });
    }

    const tokenData = await Notifications.getExpoPushTokenAsync();
    const token = tokenData.data;
    setExpoPushToken(token);
    return token;
  };

  // Auto-request on mount
  useEffect(() => {
    if (autoRequest) {
      requestPermissions();
    }
  }, [autoRequest]);

  // Listen for foreground notifications
  useEffect(() => {
    let foregroundSub: { remove: () => void } | null = null;

    (async () => {
      const Notifications = await getNotifications();
      if (!Notifications) return;

      // Set default handler for foreground notifications
      Notifications.setNotificationHandler({
        handleNotification: async () => ({
          shouldShowAlert: true,
          shouldPlaySound: true,
          shouldSetBadge: true,
          priority: Notifications.AndroidNotificationPriority.HIGH,
        }),
      });

      foregroundSub = Notifications.addNotificationReceivedListener(
        (notif) => {
          setNotification(notif);
        },
      );
    })();

    return () => {
      foregroundSub?.remove();
    };
  }, []);

  // Listen for notification taps
  useEffect(() => {
    let responseSub: { remove: () => void } | null = null;

    (async () => {
      const Notifications = await getNotifications();
      if (!Notifications) return;

      responseSub = Notifications.addNotificationResponseReceivedListener(
        (response) => {
          const data = response.notification.request.content.data as Record<
            string,
            unknown
          >;
          onNotificationTap?.(data);
        },
      );
    })();

    return () => {
      responseSub?.remove();
    };
  }, [onNotificationTap]);

  return { expoPushToken, notification, requestPermissions };
}
