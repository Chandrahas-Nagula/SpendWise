/**
 * App Entry Point — SpendWise
 *
 * Wraps the entire app in required providers:
 * 1. SafeAreaProvider
 * 2. ThemeProvider (dark/light + system detection)
 * 3. NavigationContainer (React Navigation)
 * 4. StatusBar (auto adapts to theme)
 */

import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { ThemeProvider, AuthProvider } from "./src/stores";
import { useTheme } from "./src/hooks/use-theme";
import { RootNavigator } from "./src/navigation/root-navigator";
import { AddExpenseProvider } from "./src/providers/add-expense-provider";
import { AchievementsProvider } from "./src/stores/achievements-provider";
import { DEEP_LINK } from "./src/constants/routes";
import { Colors, BRAND } from "./src/constants/colors";

// ---------------------------------------------------------------------------
//  Inner shell (needs ThemeProvider above it for useTheme)
// ---------------------------------------------------------------------------

const AppShell: React.FC = () => {
  const { isDark, colors } = useTheme();

  const linking = {
    prefixes: [DEEP_LINK.PREFIX],
  };

  return (
    <>
      <StatusBar style={isDark ? "light" : "dark"} />
      <AuthProvider>
        <NavigationContainer
          linking={linking}
          theme={{
            dark: isDark,
            colors: {
              primary: BRAND.PRIMARY_START,
              background: colors.BACKGROUND,
              card: colors.SURFACE_1,
              text: colors.TEXT_PRIMARY,
              border: colors.BORDER,
              notification: BRAND.PRIMARY_START,
            },
            fonts: {
              regular: { fontFamily: "System", fontWeight: "400" },
              medium: { fontFamily: "System", fontWeight: "500" },
              bold: { fontFamily: "System", fontWeight: "700" },
              heavy: { fontFamily: "System", fontWeight: "800" },
            },
          }}
        >
          <AchievementsProvider>
            <AddExpenseProvider>
              <RootNavigator />
            </AddExpenseProvider>
          </AchievementsProvider>
        </NavigationContainer>
      </AuthProvider>
    </>
  );
};

// ---------------------------------------------------------------------------
//  Root App Component
// ---------------------------------------------------------------------------

export default function App(): React.JSX.Element {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppShell />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
