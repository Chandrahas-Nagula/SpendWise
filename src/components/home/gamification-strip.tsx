/**
 * GamificationStrip — Streak + Achievement Count mini bar
 *
 * 🔥 15 Day Streak | 12/42 Unlocked  [mini bar]
 * Background: subtle gold/amber gradient at 10% opacity.
 * Tappable → navigates to Achievements screen.
 *
 * Now uses real data instead of mock.
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
  ANIMATION,
  TOUCH_TARGET,
} from "../../constants/sizes";
import { BudgetProgressBar } from "../budget/budget-progress-bar";

export interface GamificationData {
  streak: number;
  unlockedCount: number;
  totalCount: number;
}

interface GamificationStripProps {
  data: GamificationData;
  onPress?: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const GamificationStrip: React.FC<GamificationStripProps> = ({
  data,
  onPress,
}) => {
  const { colors, isDark } = useTheme();
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

  const bgColor = isDark
    ? "rgba(251, 191, 36, 0.10)"
    : "rgba(245, 158, 11, 0.08)";
  const pct =
    data.totalCount > 0
      ? Math.round((data.unlockedCount / data.totalCount) * 100)
      : 0;

  // Determine streak label
  const streakLabel =
    data.streak >= 100
      ? "🔥 LEGENDARY!"
      : data.streak >= 30
        ? "🔥 On Fire!"
        : data.streak >= 7
          ? "🔥 Hot Streak!"
          : "🔥";

  return (
    <AnimatedPressable
      style={[animatedStyle, styles.container, { backgroundColor: bgColor }]}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
      accessibilityLabel={`${data.streak} day streak, ${data.unlockedCount} of ${data.totalCount} achievements unlocked`}
      accessibilityRole="button"
    >
      {/* Left: Streak */}
      <View style={styles.leftSection}>
        <Text style={styles.fireEmoji}>{streakLabel}</Text>
        <View>
          <Text style={[styles.streakNumber, { color: colors.TEXT_PRIMARY }]}>
            {data.streak} Day Streak
          </Text>
          <Text style={[styles.achievement, { color: colors.TEXT_TERTIARY }]}>
            {data.unlockedCount} / {data.totalCount} achievements
          </Text>
        </View>
      </View>

      {/* Right: Progress */}
      <View style={styles.rightSection}>
        <Text style={[styles.levelText, { color: colors.TEXT_SECONDARY }]}>
          {pct}% Complete
        </Text>
        <View style={styles.xpBarContainer}>
          <BudgetProgressBar
            percentage={pct}
            color="#F59E0B"
            height={4}
            delay={900}
          />
        </View>
      </View>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: RADIUS.LG,
    padding: SPACING.MD,
    minHeight: TOUCH_TARGET.DEFAULT,
  },
  leftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  fireEmoji: {
    fontSize: FONT_SIZE.LG,
    marginRight: SPACING.SM,
  },
  streakNumber: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  achievement: {
    fontSize: FONT_SIZE.XXS,
    fontWeight: FONT_WEIGHT.REGULAR,
    marginTop: 1,
  },
  rightSection: {
    alignItems: "flex-end",
    width: 120,
  },
  levelText: {
    fontSize: FONT_SIZE.XXS,
    fontWeight: FONT_WEIGHT.MEDIUM,
    marginBottom: SPACING.XXXS,
  },
  xpBarContainer: {
    width: "100%",
  },
});
