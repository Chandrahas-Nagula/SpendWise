/**
 * Color System — SpendWise Design Tokens
 *
 * Full light + dark palette derived from 2024-2025 UI trends doc.
 * True OLED dark mode (#000000 background).
 * Glassmorphism overlay colors included.
 *
 * Usage: import { Colors } from '@/constants/colors';
 *        const bg = Colors[theme].background;
 */

/** Shared brand colors that don't change between themes */
export const BRAND = {
  /** Primary gradient endpoints */
  PRIMARY_START: '#6C63FF',
  PRIMARY_END: '#4FACFE',

  /** Accent / CTA */
  ACCENT: '#FF6B6B',

  /** Logo tint */
  LOGO_TINT: '#6C63FF',
} as const;

/** Semantic status colors per theme */
interface SemanticColors {
  readonly SUCCESS: string;
  readonly ERROR: string;
  readonly WARNING: string;
  readonly INFO: string;
}

/** Glassmorphism overlay tokens */
interface GlassColors {
  /** Card / surface overlay */
  readonly CARD_BG: string;
  /** Border of glass elements */
  readonly BORDER: string;
  /** Blur intensity (used as a reference; actual blur is in Sizes) */
  readonly BLUR_INTENSITY: number;
  /** Tab bar overlay */
  readonly TAB_BAR_BG: string;
  /** Modal overlay */
  readonly MODAL_OVERLAY: string;
}

/** Full palette for a single theme */
interface ThemePalette {
  /** App-wide background */
  readonly BACKGROUND: string;

  /** Elevation surfaces (cards, sheets, modals) */
  readonly SURFACE_1: string;
  readonly SURFACE_2: string;
  readonly SURFACE_3: string;

  /** Text hierarchy */
  readonly TEXT_PRIMARY: string;
  readonly TEXT_SECONDARY: string;
  readonly TEXT_TERTIARY: string;
  readonly TEXT_INVERSE: string;

  /** Borders & dividers */
  readonly BORDER: string;
  readonly DIVIDER: string;

  /** Input fields */
  readonly INPUT_BG: string;
  readonly INPUT_BORDER: string;
  readonly INPUT_PLACEHOLDER: string;

  /** Semantic */
  readonly SEMANTIC: SemanticColors;

  /** Glassmorphism */
  readonly GLASS: GlassColors;

  /** Category dot colors (used in charts & badges) */
  readonly CATEGORY_COLORS: readonly string[];

  /** Shadows */
  readonly SHADOW_COLOR: string;

  /** Tab bar */
  readonly TAB_BAR_ACTIVE: string;
  readonly TAB_BAR_INACTIVE: string;
}

// ---------------------------------------------------------------------------
//  LIGHT THEME
// ---------------------------------------------------------------------------

const LIGHT: ThemePalette = {
  BACKGROUND: '#F8F9FE',

  SURFACE_1: '#FFFFFF',
  SURFACE_2: '#F1F3F8',
  SURFACE_3: '#E8EAF0',

  TEXT_PRIMARY: '#1A1A2E',
  TEXT_SECONDARY: '#6B7280',
  TEXT_TERTIARY: '#9CA3AF',
  TEXT_INVERSE: '#FFFFFF',

  BORDER: '#E5E7EB',
  DIVIDER: '#F3F4F6',

  INPUT_BG: '#F9FAFB',
  INPUT_BORDER: '#D1D5DB',
  INPUT_PLACEHOLDER: '#9CA3AF',

  SEMANTIC: {
    SUCCESS: '#10B981',
    ERROR: '#EF4444',
    WARNING: '#F59E0B',
    INFO: '#3B82F6',
  },

  GLASS: {
    CARD_BG: 'rgba(255, 255, 255, 0.70)',
    BORDER: 'rgba(255, 255, 255, 0.50)',
    BLUR_INTENSITY: 10,
    TAB_BAR_BG: 'rgba(255, 255, 255, 0.85)',
    MODAL_OVERLAY: 'rgba(0, 0, 0, 0.40)',
  },

  CATEGORY_COLORS: [
    '#FF6B6B', // Food & Dining
    '#4ECDC4', // Transport
    '#45B7D1', // Entertainment
    '#96CEB4', // Shopping
    '#FECA57', // Bills & Utilities
    '#FF9FF3', // Health
    '#54A0FF', // Education
    '#5F27CD', // Travel
    '#01A3A4', // Groceries
    '#F368E0', // Personal Care
    '#EE5A24', // Rent / Housing
    '#6C5CE7', // Investments
  ] as const,

  SHADOW_COLOR: 'rgba(0, 0, 0, 0.08)',

  TAB_BAR_ACTIVE: '#6C63FF',
  TAB_BAR_INACTIVE: '#9CA3AF',
} as const;

// ---------------------------------------------------------------------------
//  DARK THEME — True OLED (#000000)
// ---------------------------------------------------------------------------

const DARK: ThemePalette = {
  BACKGROUND: '#000000',

  /** Elevation hierarchy per UI trends doc */
  SURFACE_1: '#1C1C1E',
  SURFACE_2: '#2C2C2E',
  SURFACE_3: '#3A3A3C',

  TEXT_PRIMARY: '#F9FAFB',
  TEXT_SECONDARY: '#D1D5DB',
  TEXT_TERTIARY: '#6B7280',
  TEXT_INVERSE: '#1A1A2E',

  BORDER: '#3A3A3C',
  DIVIDER: '#2C2C2E',

  INPUT_BG: '#1C1C1E',
  INPUT_BORDER: '#3A3A3C',
  INPUT_PLACEHOLDER: '#6B7280',

  /** Brighter semantic colors for dark mode (per UI trends doc) */
  SEMANTIC: {
    SUCCESS: '#34D399',
    ERROR: '#F87171',
    WARNING: '#FBBF24',
    INFO: '#60A5FA',
  },

  GLASS: {
    CARD_BG: 'rgba(31, 38, 50, 0.70)',
    BORDER: 'rgba(255, 255, 255, 0.10)',
    BLUR_INTENSITY: 12,
    TAB_BAR_BG: 'rgba(28, 28, 30, 0.85)',
    MODAL_OVERLAY: 'rgba(0, 0, 0, 0.70)',
  },

  /** 10-15% boosted saturation for dark mode charts */
  CATEGORY_COLORS: [
    '#FF8787', // Food & Dining
    '#63E6DB', // Transport
    '#5CC8E2', // Entertainment
    '#A8D8C0', // Shopping
    '#FFD76A', // Bills & Utilities
    '#FFB3F7', // Health
    '#6BB3FF', // Education
    '#7C4DFF', // Travel
    '#02B5B5', // Groceries
    '#F583EB', // Personal Care
    '#FF7043', // Rent / Housing
    '#8577F0', // Investments
  ] as const,

  SHADOW_COLOR: 'rgba(0, 0, 0, 0.30)',

  TAB_BAR_ACTIVE: '#818CF8',
  TAB_BAR_INACTIVE: '#6B7280',
} as const;

// ---------------------------------------------------------------------------
//  Public API
// ---------------------------------------------------------------------------

export type ThemeMode = 'light' | 'dark';

export const Colors: Record<ThemeMode, ThemePalette> = {
  light: LIGHT,
  dark: DARK,
} as const;
