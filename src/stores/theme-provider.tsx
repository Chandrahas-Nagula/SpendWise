/**
 * ThemeProvider — SpendWise
 *
 * Context provider that manages light/dark/system theme preference.
 *
 * Features:
 * - True OLED dark mode (#000000 background)
 * - Adaptive to OS appearance (Appearance API)
 * - Manual override persisted to AsyncStorage
 * - Exposes resolved mode, raw preference, isDark, setPreference, toggle
 *
 * Usage:
 *   Wrap your app root:
 *     <ThemeProvider><App /></ThemeProvider>
 *
 *   Consume in any component:
 *     const { mode, isDark, toggle } = useTheme();
 */

import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Appearance, useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import type { ThemeMode } from '../constants/colors';
import type { ThemeContextValue, ThemePreference } from '../types/theme';

// ---------------------------------------------------------------------------
//  Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = '@spendwise/theme_preference';

// ---------------------------------------------------------------------------
//  Context (undefined default — must be used inside provider)
// ---------------------------------------------------------------------------

export const ThemeContext = createContext<ThemeContextValue | undefined>(
  undefined,
);

// ---------------------------------------------------------------------------
//  Helper: resolve preference → concrete mode
// ---------------------------------------------------------------------------

/**
 * Given the user's preference and the OS color scheme, resolves to
 * a concrete 'light' | 'dark' mode.
 */
const resolveMode = (
  preference: ThemePreference,
  systemScheme: 'light' | 'dark' | null | undefined,
): ThemeMode => {
  if (preference === 'system') {
    return systemScheme === 'dark' ? 'dark' : 'light';
  }
  return preference;
};

// ---------------------------------------------------------------------------
//  Provider Component
// ---------------------------------------------------------------------------

interface ThemeProviderProps {
  readonly children: React.ReactNode;
  /** Optional initial preference override (useful for testing / Storybook) */
  readonly initialPreference?: ThemePreference;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({
  children,
  initialPreference = 'system',
}) => {
  // ── State ────────────────────────────────────────────────────────────
  const [preference, setPreferenceState] =
    useState<ThemePreference>(initialPreference);
  const [isHydrated, setIsHydrated] = useState<boolean>(false);

  /** OS-reported color scheme (updates live when user changes system setting) */
  const systemScheme = useColorScheme();

  // ── Hydrate persisted preference on mount ──────────────────────────
  useEffect(() => {
    const hydrate = async (): Promise<void> => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (
          stored === 'light' ||
          stored === 'dark' ||
          stored === 'system'
        ) {
          setPreferenceState(stored);
        }
      } catch {
        // Silently fall back to initialPreference
      } finally {
        setIsHydrated(true);
      }
    };

    hydrate();
  }, []);

  // ── Persist whenever preference changes (after hydration) ──────────
  useEffect(() => {
    if (!isHydrated) return;

    const persist = async (): Promise<void> => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, preference);
      } catch {
        // Best-effort persistence
      }
    };

    persist();
  }, [preference, isHydrated]);

  // ── Resolved mode ──────────────────────────────────────────────────
  const mode = resolveMode(preference, systemScheme);
  const isDark = mode === 'dark';

  // ── Callbacks ──────────────────────────────────────────────────────
  const setPreference = useCallback((pref: ThemePreference): void => {
    setPreferenceState(pref);
  }, []);

  const toggle = useCallback((): void => {
    setPreferenceState((prev) => {
      const current = resolveMode(prev, Appearance.getColorScheme());
      return current === 'dark' ? 'light' : 'dark';
    });
  }, []);

  // ── Memoised context value ─────────────────────────────────────────
  const value = useMemo<ThemeContextValue>(
    () => ({
      mode,
      preference,
      isDark,
      setPreference,
      toggle,
    }),
    [mode, preference, isDark, setPreference, toggle],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};
