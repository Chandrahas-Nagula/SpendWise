/**
 * RootNavigator — Top-level auth gate + modal screens
 *
 * Contains:
 * - AuthStack (pre-auth screens)
 * - MainTabs (post-auth, nested stacks + floating tab bar)
 * - Modal screens (AddExpense, AddIncome, ReceiptScanner, FilterPanel)
 *
 * TODO #001: Replace hardcoded isAuthenticated with real auth state.
 */

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { useTheme } from "../hooks/use-theme";
import { Routes, Navigators } from "../constants/routes";
import type { RootStackParamList } from "../types/navigation";

import { MainTabNavigator } from "./tab-navigator";
import { AuthStackNavigator } from "./stacks";

// ── Modals ────────────────────────────────────────────────────────────────
import { AddIncomeScreen } from "../screens/modals/add-income-screen";
import { ReceiptScannerScreen } from "../screens/modals/receipt-scanner-screen";
import { FilterPanelScreen } from "../screens/modals/filter-panel-screen";

// ── Auth ──────────────────────────────────────────────────────────────────
import { useAuth } from "../stores";

const Root = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  const { colors } = useTheme();
  const { session, isInitialized } = useAuth();

  // Show nothing (or a splash screen) while Supabase restores the session
  if (!isInitialized) {
    return null;
  }

  // TEMP: bypass auth for dashboard preview (revert later)
  const isAuthenticated = true; // !!session;

  return (
    <Root.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.BACKGROUND },
      }}
    >
      {!isAuthenticated ? (
        // ── Unauthenticated Flow ──────────────────────────────────────────
        <Root.Screen
          name={Navigators.AUTH_STACK}
          component={AuthStackNavigator}
        />
      ) : (
        <Root.Screen name={Navigators.MAIN_TABS} component={MainTabNavigator} />
      )}

      {/* ── Modal Group (slides up from bottom) ──────────────────────── */}
      <Root.Group
        screenOptions={{
          presentation: "modal",
          animation: "slide_from_bottom",
          contentStyle: { backgroundColor: colors.BACKGROUND },
        }}
      >
        <Root.Screen name={Routes.ADD_INCOME} component={AddIncomeScreen} />
        <Root.Screen
          name={Routes.RECEIPT_SCANNER}
          component={ReceiptScannerScreen}
          options={{ presentation: "fullScreenModal" }}
        />
        <Root.Screen name={Routes.FILTER_PANEL} component={FilterPanelScreen} />
      </Root.Group>
    </Root.Navigator>
  );
};
