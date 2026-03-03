/**
 * Sizes — SpendWise Design Tokens
 *
 * Spacing, border radius, font sizes, icon sizes, animation timing,
 * and layout constants. Derived from 2024-2025 UI trends doc.
 *
 * Usage: import { Sizes } from '@/constants/sizes';
 *        const pad = Sizes.SPACING.MD;
 */

// ---------------------------------------------------------------------------
//  Spacing (4px grid system)
// ---------------------------------------------------------------------------

export const SPACING = {
  /** 4px */
  XXXS: 4,
  /** 6px */
  XXS: 6,
  /** 8px */
  XS: 8,
  /** 12px */
  SM: 12,
  /** 16px */
  MD: 16,
  /** 20px */
  LG: 20,
  /** 24px */
  XL: 24,
  /** 32px */
  XXL: 32,
  /** 40px */
  XXXL: 40,
  /** 48px */
  HUGE: 48,
  /** 64px */
  MASSIVE: 64,
} as const;

// ---------------------------------------------------------------------------
//  Border Radius
// ---------------------------------------------------------------------------

export const RADIUS = {
  /** 4px — chips, inline badges */
  XS: 4,
  /** 8px — inputs, small cards */
  SM: 8,
  /** 12px — standard cards */
  MD: 12,
  /** 16px — glassmorphic cards (per UI trends doc) */
  LG: 16,
  /** 20px — modals, bottom sheets */
  XL: 20,
  /** 24px — floating tab bar (per UI trends doc) */
  XXL: 24,
  /** Full circle */
  FULL: 9999,
} as const;

// ---------------------------------------------------------------------------
//  Typography
// ---------------------------------------------------------------------------

export const FONT_SIZE = {
  /** 10px — micro labels */
  XXXS: 10,
  /** 11px — helper text */
  XXS: 11,
  /** 12px — captions, badges */
  XS: 12,
  /** 14px — body small */
  SM: 14,
  /** 16px — body default */
  MD: 16,
  /** 18px — subtitles */
  LG: 18,
  /** 20px — section headers */
  XL: 20,
  /** 24px — screen titles */
  XXL: 24,
  /** 28px — hero numbers */
  XXXL: 28,
  /** 32px — dashboard amount */
  HERO: 32,
  /** 40px — onboarding titles */
  DISPLAY: 40,
} as const;

export const FONT_WEIGHT = {
  REGULAR: '400' as const,
  MEDIUM: '500' as const,
  SEMIBOLD: '600' as const,
  BOLD: '700' as const,
  EXTRABOLD: '800' as const,
} as const;

export const LINE_HEIGHT = {
  TIGHT: 1.2,
  NORMAL: 1.4,
  RELAXED: 1.6,
} as const;

// ---------------------------------------------------------------------------
//  Icon Sizes (matching touch target guidelines)
// ---------------------------------------------------------------------------

export const ICON_SIZE = {
  /** 16px — inline, caption-level */
  XS: 16,
  /** 20px — list item secondary */
  SM: 20,
  /** 24px — default (nav, actions) */
  MD: 24,
  /** 28px — tab bar icons */
  LG: 28,
  /** 32px — category pickers */
  XL: 32,
  /** 48px — onboarding illustrations */
  XXL: 48,
} as const;

// ---------------------------------------------------------------------------
//  Touch Targets (per WCAG AA — min 44×44dp)
// ---------------------------------------------------------------------------

export const TOUCH_TARGET = {
  /** 44dp — minimum accessible touch area */
  MIN: 44,
  /** 48dp — comfortable default */
  DEFAULT: 48,
  /** 56dp — large buttons, FAB */
  LG: 56,
  /** 64dp — primary CTA, FAB with label */
  XL: 64,
} as const;

// ---------------------------------------------------------------------------
//  Animation Timing (per UI trends doc — Disney-inspired)
// ---------------------------------------------------------------------------

export const ANIMATION = {
  /** 100ms — micro feedback (opacity toggle) */
  INSTANT: 100,
  /** 150ms — fast (button press, toggles) */
  FAST: 150,
  /** 250ms — standard transitions */
  STANDARD: 250,
  /** 300ms — card reveals, page transitions */
  MODERATE: 300,
  /** 400ms — celebrations, complex transforms */
  SLOW: 400,
  /** 500ms — major celebrations (confetti, badge unlock) */
  CELEBRATION: 500,

  /** Stagger delay per list item (max 300ms total) */
  STAGGER_DELAY: 50,

  /** Spring config (Reanimated) — button press */
  SPRING_PRESS: {
    damping: 15,
    stiffness: 300,
  },

  /** Spring config — bouncy entrance */
  SPRING_BOUNCE: {
    damping: 12,
    stiffness: 180,
  },

  /** Spring config — gentle settle */
  SPRING_GENTLE: {
    damping: 20,
    stiffness: 120,
  },

  /** Button press scale */
  PRESS_SCALE: 0.95,
} as const;

// ---------------------------------------------------------------------------
//  Layout Constants
// ---------------------------------------------------------------------------

export const LAYOUT = {
  /** Screen horizontal padding */
  SCREEN_PADDING_H: 20,

  /** Bottom tab bar */
  TAB_BAR_HEIGHT: 60,
  TAB_BAR_BOTTOM_OFFSET: 16,
  TAB_BAR_HORIZONTAL_MARGIN: 20,

  /** Header */
  HEADER_HEIGHT: 56,

  /** Bottom sheet snap points */
  BOTTOM_SHEET_PEEK: 0.4,
  BOTTOM_SHEET_HALF: 0.55,
  BOTTOM_SHEET_FULL: 0.92,

  /** FAB (Floating Action Button) */
  FAB_SIZE: 56,
  FAB_BOTTOM_OFFSET: 90,
  FAB_RIGHT_OFFSET: 20,

  /** Card */
  CARD_MIN_HEIGHT: 72,

  /** Glassmorphism blur */
  GLASS_BLUR_RADIUS: 10,
  GLASS_BLUR_RADIUS_DARK: 12,
} as const;

// ---------------------------------------------------------------------------
//  Public API
// ---------------------------------------------------------------------------

export const Sizes = {
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  ICON_SIZE,
  TOUCH_TARGET,
  ANIMATION,
  LAYOUT,
} as const;
