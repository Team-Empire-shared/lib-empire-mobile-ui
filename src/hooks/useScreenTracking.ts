/**
 * Hook to automatically track screen view duration.
 * Use in every screen component.
 */
import { useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import { analyticsEngine } from '../analytics/analytics-engine';

export function useScreenTracking(screenName: string, properties?: Record<string, unknown>) {
  const tracked = useRef(false);

  useFocusEffect(() => {
    if (!tracked.current) {
      analyticsEngine.screen(screenName, properties);
      tracked.current = true;
    }
    return () => {
      tracked.current = false;
    };
  });
}
