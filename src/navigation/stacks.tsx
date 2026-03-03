/**
 * Stack Navigators — Auth, Home, Transactions, Analytics, Profile
 *
 * Each stack is defined as its own component for use inside the tab navigator
 * or root navigator. All stacks are type-safe via param list generics.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useTheme } from "../hooks/use-theme";
import { Routes } from "../constants/routes";
import type {
  AuthStackParamList,
  HomeStackParamList,
  TransactionsStackParamList,
  AnalyticsStackParamList,
  ProfileStackParamList,
} from "../types/navigation";

// ── Screen imports — Auth ─────────────────────────────────────────────────
import { SplashScreen } from "../screens/auth/splash-screen";
import { OnboardingScreen } from "../screens/auth/onboarding-screen";
import { LoginScreen } from "../screens/auth/login-screen";
import { SignupScreen } from "../screens/auth/signup-screen";

// ── Screen imports — Home ─────────────────────────────────────────────────
import { DashboardScreen } from "../screens/main/dashboard-screen";
import { BudgetDetailScreen } from "../screens/main/budget-detail-screen";
import { TransactionDetailScreen } from "../screens/main/transaction-detail-screen";

// ── Screen imports — Transactions ─────────────────────────────────────────
import { TransactionsListScreen } from "../screens/main/transactions-list-screen";
import { TransactionEditScreen } from "../screens/main/transaction-edit-screen";

// ── Screen imports — Analytics ────────────────────────────────────────────
import { AnalyticsScreen } from "../screens/main/analytics-screen";
import { ExportReportScreen } from "../screens/main/export-report-screen";

// ── Screen imports — Profile ──────────────────────────────────────────────
import { ProfileScreen } from "../screens/main/profile-screen";
import { SettingsScreen } from "../screens/main/settings-screen";
import { CategoryManagementScreen } from "../screens/main/category-management-screen";
import { BudgetSetupScreen } from "../screens/main/budget-setup-screen";
import { RecurringTransactionsScreen } from "../screens/main/recurring-transactions-screen";
import { AchievementsScreen } from "../screens/main/achievements-screen";
import { EditProfileScreen } from "../screens/main/edit-profile-screen";
import { NotificationSettingsScreen } from "../screens/main/notification-settings-screen";

// ===========================================================================
//  AUTH STACK
// ===========================================================================

const Auth = createNativeStackNavigator<AuthStackParamList>();

export const AuthStackNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Auth.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.BACKGROUND },
        animation: "slide_from_right",
      }}
    >
      <Auth.Screen name={Routes.SPLASH} component={SplashScreen} />
      <Auth.Screen name={Routes.ONBOARDING} component={OnboardingScreen} />
      <Auth.Screen name={Routes.LOGIN} component={LoginScreen} />
      <Auth.Screen name={Routes.SIGNUP} component={SignupScreen} />
    </Auth.Navigator>
  );
};

// ===========================================================================
//  HOME STACK
// ===========================================================================

const Home = createNativeStackNavigator<HomeStackParamList>();

export const HomeStackNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Home.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.BACKGROUND },
        animation: "slide_from_right",
      }}
    >
      <Home.Screen name={Routes.DASHBOARD} component={DashboardScreen} />
      <Home.Screen name={Routes.BUDGET_DETAIL} component={BudgetDetailScreen} />
      <Home.Screen
        name={Routes.TRANSACTION_DETAIL}
        component={TransactionDetailScreen}
      />
    </Home.Navigator>
  );
};

// ===========================================================================
//  TRANSACTIONS STACK
// ===========================================================================

const Transactions = createNativeStackNavigator<TransactionsStackParamList>();

export const TransactionsStackNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Transactions.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.BACKGROUND },
        animation: "slide_from_right",
      }}
    >
      <Transactions.Screen
        name={Routes.TRANSACTIONS_LIST}
        component={TransactionsListScreen}
      />
      <Transactions.Screen
        name={Routes.TRANSACTION_DETAIL}
        component={TransactionDetailScreen}
      />
      <Transactions.Screen
        name={Routes.TRANSACTION_EDIT}
        component={TransactionEditScreen}
      />
    </Transactions.Navigator>
  );
};

// ===========================================================================
//  ANALYTICS STACK
// ===========================================================================

const AnalyticsStack = createNativeStackNavigator<AnalyticsStackParamList>();

export const AnalyticsStackNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <AnalyticsStack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.BACKGROUND },
        animation: "slide_from_right",
      }}
    >
      <AnalyticsStack.Screen
        name={Routes.ANALYTICS}
        component={AnalyticsScreen}
      />
      <AnalyticsStack.Screen
        name={Routes.EXPORT_REPORT}
        component={ExportReportScreen}
      />
    </AnalyticsStack.Navigator>
  );
};

// ===========================================================================
//  PROFILE STACK
// ===========================================================================

const Profile = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator: React.FC = () => {
  const { colors } = useTheme();

  return (
    <Profile.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.BACKGROUND },
        animation: "slide_from_right",
      }}
    >
      <Profile.Screen name={Routes.PROFILE} component={ProfileScreen} />
      <Profile.Screen name={Routes.SETTINGS} component={SettingsScreen} />
      <Profile.Screen
        name={Routes.CATEGORY_MANAGEMENT}
        component={CategoryManagementScreen}
      />
      <Profile.Screen
        name={Routes.BUDGET_SETUP}
        component={BudgetSetupScreen}
      />
      <Profile.Screen
        name={Routes.RECURRING_TRANSACTIONS}
        component={RecurringTransactionsScreen}
      />
      <Profile.Screen
        name={Routes.ACHIEVEMENTS}
        component={AchievementsScreen}
      />
      <Profile.Screen
        name={Routes.EDIT_PROFILE}
        component={EditProfileScreen}
      />
      <Profile.Screen
        name={Routes.NOTIFICATION_SETTINGS}
        component={NotificationSettingsScreen}
      />
    </Profile.Navigator>
  );
};
