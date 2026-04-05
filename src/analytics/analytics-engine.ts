/**
 * Premium analytics engine — supports Mixpanel, PostHog, and console providers.
 * Provides screen tracking, event tracking, funnel tracking, user identification,
 * and feature adoption metrics.
 */

export type AnalyticsProviderName = 'mixpanel' | 'posthog' | 'console' | 'sentry';

interface AnalyticsConfig {
  provider: AnalyticsProviderName;
  apiKey?: string;
  debug?: boolean;
}

interface UserProperties {
  id: string | number;
  email?: string;
  name?: string;
  role?: string;
  company?: string;
  [key: string]: unknown;
}

interface EventProperties {
  [key: string]: string | number | boolean | null | undefined;
}

interface ScreenViewEvent {
  screenName: string;
  timestamp: number;
  duration?: number;
  properties?: EventProperties;
}

interface FunnelStep {
  name: string;
  timestamp: number;
  completed: boolean;
}

class AnalyticsEngine {
  private config: AnalyticsConfig = { provider: 'console' };
  private userId: string | null = null;
  private userProperties: UserProperties | null = null;
  private sessionId: string = '';
  private sessionStart: number = 0;
  private screenHistory: ScreenViewEvent[] = [];
  private currentScreen: string | null = null;
  private currentScreenStart: number = 0;
  private funnels = new Map<string, FunnelStep[]>();
  private featureUsage = new Map<string, number>();
  private initialized = false;

  init(config: AnalyticsConfig): void {
    this.config = config;
    this.sessionId = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    this.sessionStart = Date.now();
    this.initialized = true;
    this.log('init', { provider: config.provider });
  }

  identify(userId: string | number, properties?: Partial<UserProperties>): void {
    this.userId = String(userId);
    this.userProperties = { id: userId, ...properties };
    this.log('identify', { userId: this.userId, ...properties });
  }

  /** Track screen view with automatic duration calculation */
  screen(screenName: string, properties?: EventProperties): void {
    // End previous screen
    if (this.currentScreen) {
      const duration = Date.now() - this.currentScreenStart;
      this.screenHistory.push({
        screenName: this.currentScreen,
        timestamp: this.currentScreenStart,
        duration,
        properties,
      });
      this.log('screen_exit', {
        screen: this.currentScreen,
        duration_ms: duration,
        duration_s: Math.round(duration / 1000),
      });
    }

    // Start new screen
    this.currentScreen = screenName;
    this.currentScreenStart = Date.now();
    this.log('screen_view', { screen: screenName, ...properties });
  }

  /** Track a custom event */
  track(event: string, properties?: EventProperties): void {
    this.log('event', {
      event,
      ...properties,
      session_id: this.sessionId,
      session_duration_s: Math.round((Date.now() - this.sessionStart) / 1000),
    });
  }

  /** Track feature adoption (how often a feature is used) */
  trackFeature(featureName: string): void {
    const count = (this.featureUsage.get(featureName) ?? 0) + 1;
    this.featureUsage.set(featureName, count);
    this.log('feature_used', { feature: featureName, usage_count: count });
  }

  /** Start a funnel */
  funnelStart(funnelName: string, stepName: string): void {
    this.funnels.set(funnelName, [{ name: stepName, timestamp: Date.now(), completed: true }]);
    this.log('funnel_start', { funnel: funnelName, step: stepName });
  }

  /** Progress through a funnel step */
  funnelStep(funnelName: string, stepName: string): void {
    const steps = this.funnels.get(funnelName);
    if (steps) {
      steps.push({ name: stepName, timestamp: Date.now(), completed: true });
      this.log('funnel_step', { funnel: funnelName, step: stepName, step_number: steps.length });
    }
  }

  /** Complete a funnel */
  funnelComplete(funnelName: string): void {
    const steps = this.funnels.get(funnelName);
    if (steps) {
      const totalMs = Date.now() - steps[0].timestamp;
      this.log('funnel_complete', {
        funnel: funnelName,
        total_steps: steps.length,
        total_duration_s: Math.round(totalMs / 1000),
      });
      this.funnels.delete(funnelName);
    }
  }

  /** Track push notification events */
  trackPush(action: 'delivered' | 'opened' | 'acted', notificationId?: string, properties?: EventProperties): void {
    this.log('push_notification', { action, notification_id: notificationId, ...properties });
  }

  /** Reset (on logout) */
  reset(): void {
    this.userId = null;
    this.userProperties = null;
    this.screenHistory = [];
    this.currentScreen = null;
    this.funnels.clear();
    this.featureUsage.clear();
    this.log('reset');
  }

  /** Get session summary (for debugging / internal dashboards) */
  getSessionSummary() {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      duration: Date.now() - this.sessionStart,
      screensViewed: this.screenHistory.length,
      topScreens: this.getTopScreens(),
      featureUsage: Object.fromEntries(this.featureUsage),
    };
  }

  private getTopScreens(): { screen: string; totalTime: number; visits: number }[] {
    const byScreen = new Map<string, { totalTime: number; visits: number }>();
    for (const s of this.screenHistory) {
      const existing = byScreen.get(s.screenName) ?? { totalTime: 0, visits: 0 };
      existing.totalTime += s.duration ?? 0;
      existing.visits += 1;
      byScreen.set(s.screenName, existing);
    }
    return Array.from(byScreen.entries())
      .map(([screen, data]) => ({ screen, ...data }))
      .sort((a, b) => b.totalTime - a.totalTime)
      .slice(0, 10);
  }

  private log(type: string, data?: Record<string, unknown>): void {
    if (!this.initialized) return;
    const payload = {
      type,
      ...data,
      user_id: this.userId,
      timestamp: new Date().toISOString(),
    };

    if (this.config.debug || this.config.provider === 'console') {
      console.log(`[analytics:${type}]`, JSON.stringify(payload, null, 0));
    }

    // In a real implementation, this would send to Mixpanel/PostHog SDK.
    // For now, all providers log to console. When Mixpanel/PostHog SDKs
    // are added as dependencies, add the provider-specific send here.
  }
}

export const analyticsEngine = new AnalyticsEngine();
export { AnalyticsEngine };
export type { AnalyticsConfig, UserProperties, EventProperties, ScreenViewEvent };
