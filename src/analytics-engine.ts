// Sub-barrel: analytics engine
// Import via: import { ... } from '@empireoe/mobile-ui/analytics-engine'

export {
  analyticsEngine,
  AnalyticsEngine,
  type AnalyticsConfig,
  type UserProperties as AnalyticsUserProperties,
  type EventProperties as AnalyticsEventProperties,
  type ScreenViewEvent,
  type AnalyticsProviderName,
} from "./analytics/analytics-engine";
export { useScreenTracking } from "./hooks/useScreenTracking";
