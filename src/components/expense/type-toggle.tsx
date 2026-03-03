/**
 * TypeToggle — Expense / Income animated pill toggle.
 *
 * Expense = red accent, Income = green accent.
 * Spring animation on switch.
 */

import React, { useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../hooks/use-theme";
import {
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  ANIMATION,
} from "../../constants/sizes";

type TransactionType = "expense" | "income";

interface TypeToggleProps {
  value: TransactionType;
  onChange: (type: TransactionType) => void;
}

export const TypeToggle: React.FC<TypeToggleProps> = ({ value, onChange }) => {
  const { colors, isDark } = useTheme();
  const indicatorPosition = useSharedValue(value === "expense" ? 0 : 1);

  const animatedIndicator = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring(indicatorPosition.value * 100 + "%", {
          ...ANIMATION.SPRING_PRESS,
        }) as unknown as number,
      },
    ],
  }));

  // Use layout-based animation instead
  const handleSelect = useCallback(
    (type: TransactionType) => {
      if (type === value) return;
      onChange(type);
      if (Platform.OS !== "web") {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }
    },
    [value, onChange],
  );

  const expenseActive = value === "expense";
  const incomeActive = value === "income";

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: isDark
            ? "rgba(255,255,255,0.06)"
            : "rgba(0,0,0,0.04)",
        },
      ]}
    >
      <Pressable
        style={[
          styles.option,
          expenseActive && {
            backgroundColor: isDark
              ? "rgba(239,68,68,0.2)"
              : "rgba(239,68,68,0.12)",
          },
          expenseActive && styles.optionActive,
        ]}
        onPress={() => handleSelect("expense")}
        accessibilityLabel="Expense"
        accessibilityRole="button"
        accessibilityState={{ selected: expenseActive }}
      >
        <Text style={styles.optionIcon}>💸</Text>
        <Text
          style={[
            styles.optionLabel,
            {
              color: expenseActive
                ? colors.SEMANTIC.ERROR
                : colors.TEXT_SECONDARY,
              fontWeight: expenseActive ? FONT_WEIGHT.BOLD : FONT_WEIGHT.MEDIUM,
            },
          ]}
        >
          Expense
        </Text>
      </Pressable>

      <Pressable
        style={[
          styles.option,
          incomeActive && {
            backgroundColor: isDark
              ? "rgba(16,185,129,0.2)"
              : "rgba(16,185,129,0.12)",
          },
          incomeActive && styles.optionActive,
        ]}
        onPress={() => handleSelect("income")}
        accessibilityLabel="Income"
        accessibilityRole="button"
        accessibilityState={{ selected: incomeActive }}
      >
        <Text style={styles.optionIcon}>💰</Text>
        <Text
          style={[
            styles.optionLabel,
            {
              color: incomeActive
                ? colors.SEMANTIC.SUCCESS
                : colors.TEXT_SECONDARY,
              fontWeight: incomeActive ? FONT_WEIGHT.BOLD : FONT_WEIGHT.MEDIUM,
            },
          ]}
        >
          Income
        </Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    borderRadius: RADIUS.LG,
    padding: SPACING.XXXS,
    marginBottom: SPACING.MD,
    gap: SPACING.XXXS,
  },
  option: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: SPACING.SM,
    borderRadius: RADIUS.MD,
    gap: SPACING.XS,
  },
  optionActive: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  optionIcon: {
    fontSize: FONT_SIZE.MD,
  },
  optionLabel: {
    fontSize: FONT_SIZE.SM,
  },
});
