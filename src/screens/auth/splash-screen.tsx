import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { useTheme } from "../../hooks/use-theme";
import { Routes } from "../../constants/routes";
import { BRAND } from "../../constants/colors";
import type { AuthStackParamList } from "../../types/navigation";

type Nav = NativeStackNavigationProp<AuthStackParamList>;

export const SplashScreen: React.FC = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<Nav>();

  return (
    <View style={[styles.container, { backgroundColor: colors.BACKGROUND }]}>
      <Text style={styles.logo}>💰</Text>
      <Text style={[styles.title, { color: colors.TEXT_PRIMARY }]}>
        SpendWise
      </Text>
      <Text style={[styles.subtitle, { color: colors.TEXT_SECONDARY }]}>
        Track smarter. Spend wiser.
      </Text>

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => navigation.navigate(Routes.LOGIN)}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.secondaryButton, { borderColor: BRAND.PRIMARY_START }]}
          onPress={() => navigation.navigate(Routes.SIGNUP)}
          activeOpacity={0.8}
        >
          <Text
            style={[styles.secondaryButtonText, { color: BRAND.PRIMARY_START }]}
          >
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logo: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 48,
  },
  buttonGroup: {
    width: "100%",
    maxWidth: 320,
    gap: 12,
  },
  primaryButton: {
    height: 52,
    borderRadius: 12,
    backgroundColor: BRAND.PRIMARY_START,
    justifyContent: "center",
    alignItems: "center",
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  secondaryButton: {
    height: 52,
    borderRadius: 12,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: "700",
  },
});
