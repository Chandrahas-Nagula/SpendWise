/**
 * Navigation Types — Type-Safe Param Lists
 *
 * Defines param lists for every navigator so that
 * navigation.navigate() calls are fully typed.
 */

import type { NavigatorScreenParams } from "@react-navigation/native";

// ---------------------------------------------------------------------------
//  Auth Stack
// ---------------------------------------------------------------------------

export type AuthStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
};

// ---------------------------------------------------------------------------
//  Home Stack
// ---------------------------------------------------------------------------

export type HomeStackParamList = {
  Dashboard: undefined;
  BudgetDetail: { budgetId: string };
  TransactionDetail: { transactionId: string };
};

// ---------------------------------------------------------------------------
//  Transactions Stack
// ---------------------------------------------------------------------------

export type TransactionsStackParamList = {
  TransactionsList: undefined;
  TransactionDetail: { transactionId: string };
  TransactionEdit: { transactionId: string };
};

// ---------------------------------------------------------------------------
//  Analytics Stack
// ---------------------------------------------------------------------------

export type AnalyticsStackParamList = {
  Analytics: undefined;
  ExportReport: { period?: string };
};

// ---------------------------------------------------------------------------
//  Profile Stack
// ---------------------------------------------------------------------------

export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  CategoryManagement: undefined;
  BudgetSetup: undefined;
  RecurringTransactions: undefined;
  Achievements: undefined;
  EditProfile: undefined;
  NotificationSettings: undefined;
};

// ---------------------------------------------------------------------------
//  Main Tabs (each tab is a nested stack)
// ---------------------------------------------------------------------------

export type MainTabsParamList = {
  HomeStack: NavigatorScreenParams<HomeStackParamList>;
  TransactionsStack: NavigatorScreenParams<TransactionsStackParamList>;
  AnalyticsStack: NavigatorScreenParams<AnalyticsStackParamList>;
  ProfileStack: NavigatorScreenParams<ProfileStackParamList>;
};

// ---------------------------------------------------------------------------
//  Root Navigator (auth gate + modals)
// ---------------------------------------------------------------------------

export type RootStackParamList = {
  AuthStack: NavigatorScreenParams<AuthStackParamList>;
  MainTabs: NavigatorScreenParams<MainTabsParamList>;
  // Modals (presented over tabs)
  AddExpense: undefined;
  AddIncome: undefined;
  ReceiptScanner: undefined;
  FilterPanel: undefined;
};

// ---------------------------------------------------------------------------
//  Global type augmentation for useNavigation / useRoute
// ---------------------------------------------------------------------------

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
