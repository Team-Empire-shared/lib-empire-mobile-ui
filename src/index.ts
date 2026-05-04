// ── Lib ─────────────────────────────────────────────────────────────────
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
  colors,
  appleColors,
  cardShadow,
  premiumDark,
  premiumTabBarOptions,
  productColors,
  spacing,
  radius,
  fontSizes,
  fontWeights,
  typography,
  commonStyles,
  lweTheme,
  empireoTheme,
  empireoDarkTheme,
  eoeTheme,
  eoeDarkTheme,
  codnovTheme,
  codnovDarkTheme,
  egpnTheme,
  egpnDarkTheme,
  afterServicesTheme,
  afterServicesDarkTheme,
} from "./lib/theme";
export {
  useInfiniteList,
  type UseInfiniteListOptions,
  type UseInfiniteListResult,
} from "./lib/useInfiniteList";

// ── Components ──────────────────────────────────────────────────────────
export { OfflineBanner, type OfflineBannerProps } from "./components/OfflineBanner";
export { ErrorBoundary } from "./components/ErrorBoundary";
export {
  Skeleton,
  SkeletonCard,
  SkeletonStats,
  SkeletonDetail,
} from "./components/Skeleton";
export {
  ToastContainer,
  useToastStore,
  toast,
  type ToastContainerProps,
} from "./components/Toast";
export { InfiniteList, type InfiniteListProps } from "./components/InfiniteList";
export { Avatar, type AvatarProps } from "./components/Avatar";
export { AnimatedCard, type AnimatedCardProps } from "./components/AnimatedCard";
export { AnimatedButton, type AnimatedButtonProps } from "./components/AnimatedButton";
export { FadeInView, type FadeInViewProps } from "./components/FadeInView";
export {
  tapLight,
  tapMedium,
  tapHeavy,
  notifySuccess,
  notifyError,
  notifyWarning,
  selectionTick,
} from "./lib/haptics";
export { CompanyLogo, type CompanyLogoProps } from "./components/CompanyLogo";
export { GradientHeader, type GradientHeaderProps } from "./components/GradientHeader";
export { BottomSheet, type BottomSheetProps } from "./components/BottomSheet";
export { SwipeableRow, type SwipeAction, type SwipeableRowProps } from "./components/SwipeableRow";
export { FAB, type FABProps } from "./components/FAB";
export { StalenessBadge, type StalenessBadgeProps } from "./components/StalenessBadge";
export { useSWR, type UseSWROptions, type UseSWRResult } from "./lib/useSWR";
export { EmptyState, type EmptyStateProps } from "./components/EmptyState";
export {
  OnboardingChecklist,
  type OnboardingChecklistProps,
  type ChecklistItem,
} from "./components/OnboardingChecklist";
export { ProfileCompleteness, type ProfileCompletenessProps } from "./components/ProfileCompleteness";
export { FormTextInput, type FormTextInputProps } from "./components/FormTextInput";
export { FormSelect, type FormSelectProps, type SelectOption } from "./components/FormSelect";
export {
  usePushNotifications,
  type PushNotificationOptions,
  type PushNotificationResult,
} from "./lib/usePushNotifications";
export { CachedImage, type CachedImageProps } from "./components/CachedImage";
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
export { StepProgress, type StepProgressProps } from "./components/StepProgress";
export { useScreenTracking } from "./hooks/useScreenTracking";
