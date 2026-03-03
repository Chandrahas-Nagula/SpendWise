/**
 * Theme Types — SpendWise
 *
 * Shared interfaces for the theming system.
 * Kept in types/ so both stores/ and hooks/ can import without circular deps.
 */

import type { ThemeMode } from '../constants/colors';

// ---------------------------------------------------------------------------
//  Theme preference (what the user chose)
// ---------------------------------------------------------------------------

/** User's theme selection — 'system' defers to OS preference */
export type ThemePreference = 'light' | 'dark' | 'system';

// ---------------------------------------------------------------------------
//  Theme context value
// ---------------------------------------------------------------------------

/** Shape of the value provided by ThemeContext */
export interface ThemeContextValue {
  /** Resolved active mode (never 'system' — always resolved to light/dark) */
  readonly mode: ThemeMode;

  /** User's raw preference (may be 'system') */
  readonly preference: ThemePreference;

  /** Whether the resolved mode is dark */
  readonly isDark: boolean;

  /** Change the theme preference (persisted to AsyncStorage) */
  readonly setPreference: (pref: ThemePreference) => void;

  /** Convenience toggle between light and dark (ignores system) */
  readonly toggle: () => void;
}
