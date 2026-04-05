/**
 * Theme hook — returns current theme colors based on system preference.
 * Apps can override with forced light/dark mode.
 */
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme, type ThemeColors } from '../design-system';

type ThemeMode = 'light' | 'dark' | 'system';

let _forcedMode: ThemeMode = 'system';

export function setThemeMode(mode: ThemeMode): void {
  _forcedMode = mode;
}

export function useTheme(): { colors: ThemeColors; isDark: boolean; mode: ThemeMode } {
  const systemScheme = useColorScheme();

  const isDark = _forcedMode === 'system'
    ? systemScheme === 'dark'
    : _forcedMode === 'dark';

  return {
    colors: isDark ? darkTheme : lightTheme,
    isDark,
    mode: _forcedMode,
  };
}

export type { ThemeMode, ThemeColors };
