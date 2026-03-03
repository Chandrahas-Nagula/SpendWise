/**
 * CategorySpendingRow — Single category row with animated progress bar
 *
 * Shows: category icon + name | ₹amount | percentage of total spending
 * Animated progress bar in category color.
 * Subtle gradient bg at 8% opacity of category color.
 */

import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../../hooks/use-theme";
import { SPACING, RADIUS, FONT_SIZE, FONT_WEIGHT } from "../../constants/sizes";
import { formatINR } from "../../utils/greeting";
import { BudgetProgressBar } from "../budget/budget-progress-bar";

interface CategorySpendingRowProps {
  /** Category name */
  name: string;
  /** Category icon (emoji) */
  icon: string;
  /** Category color (hex) */
  color: string;
  /** Amount spent in this category */
  spent: number;
  /** Percentage of total spending (0–100) */
  percentage: number;
  /** Delay for staggered progress bar animation */
  animDelay?: number;
}

export const CategorySpendingRow: React.FC<CategorySpendingRowProps> = ({
  name,
  icon,
  color,
  spent,
  percentage,
  animDelay = 0,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: `${color}12` }]}>
      {/* Top row: Icon + name ... amount + percentage */}
      <View style={styles.topRow}>
        <View style={styles.leftGroup}>
          <View style={[styles.iconCircle, { backgroundColor: `${color}20` }]}>
            {icon.length > 2 ? (
              <Ionicons name={icon as any} size={18} color={color} />
            ) : (
              <Text style={styles.iconText}>{icon}</Text>
            )}
          </View>
          <Text
            style={[styles.categoryName, { color: colors.TEXT_PRIMARY }]}
            numberOfLines={1}
          >
            {name}
          </Text>
        </View>

        <View style={styles.rightGroup}>
          <Text style={[styles.amount, { color: colors.TEXT_PRIMARY }]}>
            {formatINR(spent)}
          </Text>
          <Text style={[styles.percentage, { color: colors.TEXT_TERTIARY }]}>
            {percentage}%
          </Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <BudgetProgressBar
          percentage={percentage}
          color={color}
          height={6}
          delay={animDelay}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: RADIUS.MD,
    padding: SPACING.SM,
    marginBottom: SPACING.XS,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: SPACING.XS,
  },
  leftGroup: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.SM,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.XS,
  },
  iconText: {
    fontSize: FONT_SIZE.MD,
  },
  categoryName: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
    flex: 1,
  },
  rightGroup: {
    alignItems: "flex-end",
    marginLeft: SPACING.XS,
  },
  amount: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
  },
  percentage: {
    fontSize: FONT_SIZE.XXS,
    fontWeight: FONT_WEIGHT.REGULAR,
    marginTop: 1,
  },
  progressContainer: {
    marginTop: SPACING.XXXS,
  },
});
