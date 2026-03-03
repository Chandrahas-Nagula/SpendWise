/**
 * Routes — Type-Safe Screen & Navigator Names
 *
 * Enum of all 22 screens + navigator names.
 * Used by React Navigation for type-safe navigation params.
 *
 * Usage: import { Routes } from '@/constants/routes';
 *        navigation.navigate(Routes.DASHBOARD);
 */

// ---------------------------------------------------------------------------
//  Navigator Names
// ---------------------------------------------------------------------------

export enum Navigators {
  /** Top-level auth vs main gate */
  ROOT = 'RootNavigator',

  /** Pre-auth stack */
  AUTH_STACK = 'AuthStack',

  /** Post-auth bottom tabs */
  MAIN_TABS = 'MainTabs',

  /** Stacks inside each tab */
  HOME_STACK = 'HomeStack',
  TRANSACTIONS_STACK = 'TransactionsStack',
  ANALYTICS_STACK = 'AnalyticsStack',
  PROFILE_STACK = 'ProfileStack',
}

// ---------------------------------------------------------------------------
//  Screen Routes (22 screens)
// ---------------------------------------------------------------------------

export enum Routes {
  // ── Auth Stack (3 screens) ──────────────────────────────────────────
  SPLASH = 'Splash',
  ONBOARDING = 'Onboarding',
  LOGIN = 'Login',
  SIGNUP = 'Signup',

  // ── Home Stack (3 screens) ──────────────────────────────────────────
  DASHBOARD = 'Dashboard',
  BUDGET_DETAIL = 'BudgetDetail',
  TRANSACTION_DETAIL = 'TransactionDetail',

  // ── Transactions Stack (2 screens) ──────────────────────────────────
  TRANSACTIONS_LIST = 'TransactionsList',
  TRANSACTION_EDIT = 'TransactionEdit',

  // ── Analytics Stack (2 screens) ─────────────────────────────────────
  ANALYTICS = 'Analytics',
  EXPORT_REPORT = 'ExportReport',

  // ── Profile Stack (6 screens) ───────────────────────────────────────
  PROFILE = 'Profile',
  SETTINGS = 'Settings',
  CATEGORY_MANAGEMENT = 'CategoryManagement',
  BUDGET_SETUP = 'BudgetSetup',
  RECURRING_TRANSACTIONS = 'RecurringTransactions',
  ACHIEVEMENTS = 'Achievements',

  // ── Modals (4 screens — presented over tabs) ────────────────────────
  ADD_EXPENSE = 'AddExpense',
  ADD_INCOME = 'AddIncome',
  RECEIPT_SCANNER = 'ReceiptScanner',
  FILTER_PANEL = 'FilterPanel',

  // ── Additional ──────────────────────────────────────────────────────
  EDIT_PROFILE = 'EditProfile',
  NOTIFICATION_SETTINGS = 'NotificationSettings',
}

// ---------------------------------------------------------------------------
//  Tab Configuration
// ---------------------------------------------------------------------------

export interface TabConfig {
  readonly route: Routes;
  readonly label: string;
  /** Icon name from your icon library (e.g. Ionicons) */
  readonly iconActive: string;
  readonly iconInactive: string;
}

export const TAB_CONFIG: readonly TabConfig[] = [
  {
    route: Routes.DASHBOARD,
    label: 'Home',
    iconActive: 'home',
    iconInactive: 'home-outline',
  },
  {
    route: Routes.TRANSACTIONS_LIST,
    label: 'Transactions',
    iconActive: 'receipt',
    iconInactive: 'receipt-outline',
  },
  {
    route: Routes.ANALYTICS,
    label: 'Analytics',
    iconActive: 'pie-chart',
    iconInactive: 'pie-chart-outline',
  },
  {
    route: Routes.PROFILE,
    label: 'Profile',
    iconActive: 'person',
    iconInactive: 'person-outline',
  },
] as const;

// ---------------------------------------------------------------------------
//  Deep Link Prefixes
// ---------------------------------------------------------------------------

export const DEEP_LINK = {
  PREFIX: 'spendwise://',
  PATHS: {
    TRANSACTION: 'transaction/:id',
    ADD_EXPENSE: 'add-expense',
    ANALYTICS: 'analytics',
  },
} as const;
