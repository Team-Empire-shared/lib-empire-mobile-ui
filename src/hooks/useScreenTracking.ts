import { useRef } from 'react';
import { useFocusEffect } from 'expo-router';
import analytics, { type EventProperties } from '../lib/analytics';

export function useScreenTracking(screenName: string, properties?: EventProperties) {
  const tracked = useRef(false);

  useFocusEffect(() => {
    if (!tracked.current) {
      analytics.screen(screenName, properties);
      tracked.current = true;
    }
    return () => {
      tracked.current = false;
    };
  });
}
