// Sub-barrel: lib utilities only
// Import via: import { ... } from '@empireoe/mobile-ui/lib'

export { getItem, setItem, deleteItem } from "./lib/storage";
export { getCached, setCached, clearCache, timeAgo } from "./lib/cache";
export {
  getQueuedActions,
  enqueueAction,
  dequeueAction,
  clearQueue,
  getQueueCount,
  type QueuedAction,
} from "./lib/offline-queue";
export {
  flushQueue,
  startSyncListener,
  setOnSyncComplete,
  setActionProcessor,
  type ActionProcessor,
} from "./lib/sync";
export {
  isBiometricAvailable,
  authenticateWithBiometric,
  startAppStateListener,
  setLockChangeListener,
  isLocked,
} from "./lib/biometric";
export {
  EmpireWebSocket,
  type WSMessage,
  type WebSocketClientConfig,
} from "./lib/websocket";
export {
  NetworkError,
  SessionExpiredError,
  isNetworkError,
  handleError,
} from "./lib/errors";
export {
  createApiClient,
  type ApiClientOptions,
  type ApiClient,
} from "./lib/createApiClient";
export {
  default as analytics,
  type EventProperties,
  type AnalyticsProvider,
} from "./lib/analytics";
export {
  checkForUpdate,
  fetchAndApplyUpdate,
  useAppUpdate,
  type UpdateStatus,
} from "./lib/appUpdate";
export {
  errorReporter,
  type ErrorReporter,
} from "./lib/errorReporting";
export {
  tapLight,
  tapMedium,
  tapHeavy,
  notifySuccess,
  notifyError,
  notifyWarning,
  selectionTick,
} from "./lib/haptics";
export { useSWR, type UseSWROptions, type UseSWRResult } from "./lib/useSWR";
export {
  usePushNotifications,
  type PushNotificationOptions,
  type PushNotificationResult,
} from "./lib/usePushNotifications";
export {
  createDeepLinkHandler,
  useNotificationRouter,
  type RouteMap,
  type DeepLinkHandler,
} from "./lib/deepLinkHandler";
export {
  requestPermission,
  checkPermission,
  showSettingsAlert,
  usePermission,
  type PermissionType,
  type PermissionResult,
  type UsePermissionReturn,
} from "./lib/permissions";
export { useCamera, type UseCameraResult } from "./lib/useCamera";
export { usePhotos, type UsePhotosResult } from "./lib/usePhotos";
export {
  useInfiniteList,
  type UseInfiniteListOptions,
  type UseInfiniteListResult,
} from "./lib/useInfiniteList";
