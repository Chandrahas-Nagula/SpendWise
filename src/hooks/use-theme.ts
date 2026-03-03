/**
 * useTheme — SpendWise
 *
 * Custom hook that provides the current theme context value
 * and resolved color palette.
 *
 * Must be used inside a <ThemeProvider>.
 *
 * Usage:
 *   const { colors, mode, isDark, toggle, setPreference } = useTheme();
 *   <View style={{ backgroundColor: colors.BACKGROUND }} />
 */

import { useContext, useMemo } from 'react';

import { Colors } from '../constants/colors';
import { ThemeContext } from '../stores/theme-provider';
import type { ThemeContextValue } from '../types/theme';

// ---------------------------------------------------------------------------
//  Extended return type (adds resolved `colors` palette)
// ---------------------------------------------------------------------------

interface UseThemeReturn extends ThemeContextValue {
  /** Resolved color palette for the active theme mode */
  readonly colors: (typeof Colors)['light'];
}

// ---------------------------------------------------------------------------
//  Hook
// ---------------------------------------------------------------------------

/**
 * Returns the active theme context plus the resolved color palette.
 *
 * @throws if used outside <ThemeProvider>
 *
 * @example
 * ```tsx
 * const { colors, isDark, toggle } = useTheme();
 *
 * return (
 *   <View style={{ backgroundColor: colors.BACKGROUND }}>
 *     <Text style={{ color: colors.TEXT_PRIMARY }}>Hello</Text>
 *     <Switch value={isDark} onValueChange={toggle} />
 *   </View>
 * );
 * ```
 */
export const useTheme = (): UseThemeReturn => {
  const ctx = useContext(ThemeContext);

  if (ctx === undefined) {
    throw new Error(
      'useTheme must be used within a <ThemeProvider>. ' +
        'Wrap your app root with <ThemeProvider> from stores/theme-provider.',
    );
  }

  const colors = useMemo(() => Colors[ctx.mode], [ctx.mode]);

  return useMemo(
    () => ({
      ...ctx,
      colors,
    }),
    [ctx, colors],
  );
};
