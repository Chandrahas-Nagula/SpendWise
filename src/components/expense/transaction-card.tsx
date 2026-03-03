/**
 * TransactionCard — Single transaction row (React.memo)
 *
 * Shows: category emoji in colored circle · description · category+date · amount
 * Red for expense, green for income.
 * Scale 0.98 on press. Min touch target 44pt.
 *
 * Accepts a `Transaction` object that works with both mock and live Supabase data.
 */

import React, { useCallback } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useTheme } from "../../hooks/use-theme";
import {
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  TOUCH_TARGET,
  ANIMATION,
} from "../../constants/sizes";
import { formatINR, getRelativeDate } from "../../utils/greeting";

// ── Universal Transaction shape ──────────────────────────────────────────

export interface Transaction {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  type: string; // "expense" | "income"
  category_id?: string | null;
  // Joined category data from Supabase
  categories?: { name: string; icon: string; color: string } | null;
}

interface TransactionCardProps {
  transaction: Transaction;
  onPress?: (transaction: Transaction) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const TransactionCardInner: React.FC<TransactionCardProps> = ({
  transaction,
  onPress,
}) => {
  const { colors } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.98, ANIMATION.SPRING_PRESS);
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, ANIMATION.SPRING_PRESS);
  }, [scale]);

  const handlePress = useCallback(() => {
    onPress?.(transaction);
  }, [onPress, transaction]);

  const isIncome = transaction.type === "income";
  const amountColor = isIncome
    ? colors.SEMANTIC.SUCCESS
    : colors.SEMANTIC.ERROR;
  const amountPrefix = isIncome ? "+" : "-";

  // Category data from Supabase join
  const catName = transaction.categories?.name ?? "Uncategorized";
  const catIcon = transaction.categories?.icon ?? "💰";
  const catColor = transaction.categories?.color ?? "#9CA3AF";

  const desc = transaction.description || catName;

  return (
    <AnimatedPressable
      style={[animatedStyle, styles.container]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      accessibilityLabel={`${desc}, ${amountPrefix}${formatINR(transaction.amount)}`}
      accessibilityRole="button"
    >
      {/* Category Icon */}
      <View
        style={[styles.iconContainer, { backgroundColor: `${catColor}20` }]}
      >
        <Text style={styles.iconText}>{catIcon}</Text>
      </View>

      {/* Description + Category + Date */}
      <View style={styles.textContainer}>
        <Text
          style={[styles.description, { color: colors.TEXT_PRIMARY }]}
          numberOfLines={1}
        >
          {desc}
        </Text>
        <Text style={[styles.meta, { color: colors.TEXT_TERTIARY }]}>
          {catName} · {getRelativeDate(transaction.date)}
        </Text>
      </View>

      {/* Amount */}
      <Text style={[styles.amount, { color: amountColor }]}>
        {amountPrefix}
        {formatINR(transaction.amount)}
      </Text>
    </AnimatedPressable>
  );
};

export const TransactionCard = React.memo(TransactionCardInner);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: SPACING.SM,
    paddingHorizontal: SPACING.XXXS,
    minHeight: TOUCH_TARGET.MIN,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: RADIUS.MD,
    justifyContent: "center",
    alignItems: "center",
    marginRight: SPACING.SM,
  },
  iconText: {
    fontSize: FONT_SIZE.XL,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.XS,
  },
  description: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    marginBottom: 2,
  },
  meta: {
    fontSize: FONT_SIZE.XS,
    fontWeight: FONT_WEIGHT.REGULAR,
  },
  amount: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
  },
});
