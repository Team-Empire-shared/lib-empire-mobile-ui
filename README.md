# @empireoe/mobile-ui

Shared React Native / Expo component library for all Empire product mobile apps. Provides UI components, theme tokens, offline support, biometric auth, caching, error reporting, push notifications, and more.

## Installation

All 17 product apps consume this library via a local file link:

```json
// In your app's package.json
{
  "dependencies": {
    "@empireoe/mobile-ui": "file:../empire-mobile-ui"
  }
}
```

Then run `npm install` in your app directory.

### Peer Dependencies (required)

- `react` >= 18.0.0
- `react-native` >= 0.73.0
- `expo` >= 50.0.0
- `expo-secure-store` >= 13.0.0
- `expo-local-authentication` >= 14.0.0
- `@react-native-async-storage/async-storage` >= 1.21.0
- `@react-native-community/netinfo` >= 11.0.0

### Optional Peer Dependencies

These are loaded lazily and degrade gracefully when not installed:

- `expo-image` -- used by `CachedImage` and `Avatar`
- `expo-notifications` -- used by `usePushNotifications` and `deepLinkHandler`
- `expo-updates` -- used by `useAppUpdate`
- `expo-camera` -- used by `useCamera` and `permissions`
- `expo-image-picker` -- used by `usePhotos` and `permissions`
- `expo-location` -- used by `permissions`
- `expo-router` -- used by `useNotificationRouter`
- `@sentry/react-native` -- used by `errorReporting`

## Quick Start

```tsx
// _layout.tsx (root layout of any Empire app)
import {
  ErrorBoundary,
  OfflineBanner,
  ToastContainer,
  toast,
  errorReporter,
  analytics,
} from "@empireoe/mobile-ui";

export default function RootLayout() {
  useEffect(() => {
    errorReporter.init("https://...@sentry.io/...");
    analytics.init({ provider: "mixpanel", token: "..." });
  }, []);

  return (
    <ErrorBoundary>
      <OfflineBanner />
      <ToastContainer />
      <Stack />
    </ErrorBoundary>
  );
}

// Any screen or service:
toast.success("Contact saved");
toast.error("Upload failed");
```

## Components

### Layout & Feedback

| Component | Props | Description |
|-----------|-------|-------------|
| `ErrorBoundary` | `children`, `fallbackTitle?`, `fallbackMessage?`, `accentColor?`, `onError?` | Catches render errors, shows retry button |
| `OfflineBanner` | `message?`, `backgroundColor?` | Shows a banner when the device is offline |
| `ToastContainer` | `topOffset?` | Renders toast notifications. Place once in root layout |
| `FadeInView` | `children`, `delay?`, `duration?`, `style?` | Animates children with fade-in on mount |
| `BottomSheet` | `visible`, `onClose`, `children`, `height?` | Modal bottom sheet with drag-to-dismiss |
| `EmptyState` | `icon?`, `title`, `message?`, `actionLabel?`, `onAction?` | Placeholder for empty lists |

### Data Display

| Component | Props | Description |
|-----------|-------|-------------|
| `Avatar` | `uri?`, `name?`, `size?`, `borderRadius?` | User avatar with initials fallback |
| `CachedImage` | `uri`, `style?`, `placeholder?`, `fallback?`, `borderRadius?`, `resizeMode?`, `alt?` | Image with memory-disk cache and shimmer |
| `CompanyLogo` | `company`, `size?`, `style?` | Renders the correct Empire company logo |
| `StalenessBadge` | `storedAt`, `style?` | Shows "2m ago" badge for cached data |
| `ProfileCompleteness` | `percentage`, `label?`, `color?` | Circular progress ring |

### Interactive

| Component | Props | Description |
|-----------|-------|-------------|
| `AnimatedCard` | `children`, `onPress?`, `delay?`, `style?` | Card with press-scale + fade-in stagger |
| `AnimatedButton` | `children`, `onPress`, `style?`, `disabled?` | Button with haptic press feedback |
| `SwipeableRow` | `children`, `leftActions?`, `rightActions?` | Row with swipe-to-reveal actions |
| `FAB` | `icon`, `onPress`, `color?`, `position?` | Floating action button |
| `InfiniteList` | `data`, `renderItem`, `onLoadMore`, `hasMore`, `loading?` | FlatList with infinite scroll |

### Forms

| Component | Props | Description |
|-----------|-------|-------------|
| `FormTextInput` | `label`, `value`, `onChangeText`, `error?`, `placeholder?` | Styled text input with error display |
| `FormSelect` | `label`, `value`, `options`, `onValueChange`, `error?` | Dropdown select with options |
| `OnboardingChecklist` | `items`, `title?` | Checklist widget for onboarding flows |

### Skeleton Loaders

| Component | Description |
|-----------|-------------|
| `Skeleton` | Base animated skeleton bar |
| `SkeletonCard` | Card-shaped placeholder |
| `SkeletonStats` | Stats row placeholder |
| `SkeletonDetail` | Detail screen placeholder |

## Lib Modules

### `storage`

Cross-platform secure storage (wraps `expo-secure-store`).

```ts
import { getItem, setItem, deleteItem } from "@empireoe/mobile-ui";

await setItem("token", "abc123");
const token = await getItem("token");
await deleteItem("token");
```

### `cache`

AsyncStorage-based cache with TTL and stale-while-revalidate support.

```ts
import { getCached, setCached, clearCache, timeAgo } from "@empireoe/mobile-ui";

await setCached("contacts", data, 5 * 60 * 1000); // 5 min TTL
const result = await getCached("contacts");
if (result && !result.expired) {
  // fresh data
} else if (result) {
  // stale data — show while refetching
  console.log(`Last updated ${timeAgo(result.storedAt)}`);
}
await clearCache();
```

### `offline-queue` + `sync`

Queue mutations while offline, auto-replay on reconnect (staff apps).

```ts
import { enqueueAction, startSyncListener, setActionProcessor } from "@empireoe/mobile-ui";

setActionProcessor(async (action) => {
  await api.post(action.endpoint, action.payload);
});
startSyncListener(); // auto-flushes when online

await enqueueAction({ type: "update_status", endpoint: "/api/status", payload: { id: 1 } });
```

### `biometric`

Face ID / fingerprint lock for staff apps.

```ts
import { isBiometricAvailable, authenticateWithBiometric, startAppStateListener } from "@empireoe/mobile-ui";

if (await isBiometricAvailable()) {
  const success = await authenticateWithBiometric("Unlock app");
}
startAppStateListener(); // auto-locks after 5 min in background
```

### `websocket`

Reconnecting WebSocket client with heartbeat.

```ts
import { EmpireWebSocket } from "@empireoe/mobile-ui";

const ws = new EmpireWebSocket({
  url: "wss://api.empireo.ai/ws",
  onMessage: (msg) => console.log(msg),
  reconnectInterval: 3000,
});
ws.connect();
```

### `errors`

Typed error classes for network and session errors.

```ts
import { NetworkError, SessionExpiredError, isNetworkError, handleError } from "@empireoe/mobile-ui";

try {
  await api.get("/data");
} catch (err) {
  if (isNetworkError(err)) {
    toast.error("No internet connection");
  }
  handleError(err); // logs + reports to Sentry
}
```

### `analytics`

Unified analytics with Mixpanel, PostHog, or console fallback.

```ts
import { analytics } from "@empireoe/mobile-ui";

analytics.init({ provider: "mixpanel", token: "..." });
analytics.track("job_applied", { jobId: "42" });
analytics.identify("user-123", { email: "a@b.com" });
```

### `errorReporting`

Sentry wrapper with console fallback.

```ts
import { errorReporter } from "@empireoe/mobile-ui";

errorReporter.init("https://...@sentry.io/...");
errorReporter.captureException(new Error("Oops"), { screen: "Home" });
errorReporter.captureMessage("User completed onboarding", "info");
errorReporter.setUser({ id: "1", email: "a@b.com" });
errorReporter.addBreadcrumb("Tapped submit", "ui");
```

### `permissions`

Unified permission system across camera, photos, location, and notifications.

```ts
import { requestPermission, checkPermission, usePermission } from "@empireoe/mobile-ui";

// Imperative
const result = await requestPermission("camera");
if (!result.granted && !result.canAskAgain) {
  showSettingsAlert("camera"); // directs user to Settings
}

// React hook
const { status, request, loading } = usePermission("camera");
```

### `appUpdate`

OTA update checker using `expo-updates`. No-ops in dev mode.

```ts
import { useAppUpdate } from "@empireoe/mobile-ui";

const { status, checkNow, applyUpdate } = useAppUpdate({ checkOnMount: true });
if (status.isAvailable) {
  await applyUpdate(); // downloads + restarts
}
```

### `deepLinkHandler`

Maps push notification data and deep link URLs to app routes.

```ts
import { createDeepLinkHandler, useNotificationRouter } from "@empireoe/mobile-ui";

const handler = createDeepLinkHandler({
  job: "/job/[id]",
  applications: "/(tabs)/applications",
});

// In _layout.tsx:
useNotificationRouter(handler);

// Imperative:
handler.handleNotification({ screen: "job", id: "42" }); // => "/job/42"
handler.parseUrl("myapp://host/job/123"); // => { screen: "job", params: { id: "123" } }
```

### `haptics`

Haptic feedback helpers.

```ts
import { tapLight, tapMedium, tapHeavy, notifySuccess, notifyError } from "@empireoe/mobile-ui";

tapLight();       // light tap on button press
notifySuccess();  // success vibration
notifyError();    // error vibration
```

### Hooks

| Hook | Description |
|------|-------------|
| `useInfiniteList` | Pagination with loading/error/hasMore state |
| `useSWR` | Stale-while-revalidate data fetching |
| `usePushNotifications` | Register for push tokens + handle foreground notifications |
| `useCamera` | Camera capture with permission handling |
| `usePhotos` | Photo picker with permission handling |
| `useAppUpdate` | OTA update status + apply |
| `usePermission` | Permission check + request with settings fallback |

## Theme Tokens

All apps share a consistent design system via theme tokens:

```ts
import { colors, spacing, radius, fontSizes, typography, commonStyles } from "@empireoe/mobile-ui";
```

### Colors

- **Brand:** `primary` (#2563eb), `primaryLight`, `primaryDark`
- **Semantic:** `success`, `warning`, `danger`, `info` (+ light variants)
- **Neutrals (light):** `background`, `card`, `border`, `text`, `textSecondary`, `textMuted`, `textPlaceholder`
- **Neutrals (dark):** `darkBackground`, `darkCard`, `darkBorder`, `darkText`, etc.
- **Status pills:** `statusNew`, `statusActive`, `statusPending`, `statusCompleted`, `statusRejected`

### Product Colors

Per-product accent overrides via `productColors`:

```ts
productColors.empireo      // #2563eb
productColors.eoe          // #2563eb
productColors.lwe          // #7c3aed
productColors.afterServices // #0d9488
productColors.egpn         // #f59e0b
productColors.codnov       // #3b82f6
```

### Spacing

`xs` (4), `sm` (8), `md` (12), `lg` (16), `xl` (20), `2xl` (24), `3xl` (32), `4xl` (40), `screenPadding` (20), `screenTop` (60)

### Border Radius

`sm` (8), `md` (10), `lg` (12), `xl` (14), `2xl` (16), `3xl` (20), `full` (9999), `pill` (20)

### Typography Presets

`h1`, `h2`, `h3`, `body`, `bodySmall`, `caption`, `label`, `button`

### Common Styles

Pre-built `ViewStyle` objects: `screen`, `screenDark`, `screenContent`, `card`, `cardDark`, `input`, `inputDark`, `buttonPrimary`, `buttonOutline`, `pill`, `row`, `rowBetween`

## Testing

```bash
npm install
npm test
```

Tests are in `src/__tests__/` and cover components (Toast, ErrorBoundary, CachedImage) and lib modules (cache, permissions, deepLinkHandler, errorReporting, appUpdate).

## Development

```bash
npm run lint    # ESLint
npm run build   # TypeScript compilation
npm test        # Jest
```

## License

Private -- internal use only.
