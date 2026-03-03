/**
 * App Constants — SpendWise Design System
 *
 * Single source of truth for all design tokens & configuration.
 * Re-exports from individual constant modules.
 */

export { Colors, BRAND } from './colors';
export type { ThemeMode } from './colors';

export {
  Sizes,
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  ICON_SIZE,
  TOUCH_TARGET,
  ANIMATION,
  LAYOUT,
} from './sizes';

export {
  DEFAULT_EXPENSE_CATEGORIES,
  DEFAULT_INCOME_CATEGORIES,
  ALL_DEFAULT_CATEGORIES,
  PAYMENT_METHODS,
  DEFAULT_CURRENCY,
} from './categories';
export type {
  TransactionType,
  CategoryDefinition,
  PaymentMethod,
  PaymentMethodDefinition,
} from './categories';

export { Routes, Navigators, TAB_CONFIG, DEEP_LINK } from './routes';
export type { TabConfig } from './routes';
