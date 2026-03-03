/**
 * BudgetProgressBar — Animated width bar
 *
 * Animates from 0 → target percentage on mount.
 * Color shifts: green <70%, amber 70–90%, red >90%.
 * Duration 800ms, Easing.out(Easing.cubic).
 */

import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { RADIUS, SPACING } from "../../constants/sizes";
import { useTheme } from "../../hooks/use-theme";

interface BudgetProgressBarProps {
  /** 0 – 100 */
  percentage: number;
  /** Override the bar color (e.g. category color) */
  color?: string;
  /** Height of the bar in px */
  height?: number;
  /** Delay before animation starts (ms) */
  delay?: number;
}

/** Get semantic color based on spending percentage */
const getBarColor = (
  pct: number,
  successColor: string,
  warningColor: string,
  errorColor: string,
): string => {
  if (pct < 70) return successColor;
  if (pct <= 90) return warningColor;
  return errorColor;
};

export const BudgetProgressBar: React.FC<BudgetProgressBarProps> = ({
  percentage,
  color,
  height = 8,
  delay = 0,
}) => {
  const { colors } = useTheme();
  const widthPct = useSharedValue(0);
  const clampedPct = Math.min(Math.max(percentage, 0), 100);

  useEffect(() => {
    const timeout = setTimeout(() => {
      widthPct.value = withTiming(clampedPct, {
        duration: 800,
        easing: Easing.out(Easing.cubic),
      });
    }, delay);

    return () => clearTimeout(timeout);
  }, [clampedPct, delay, widthPct]);

  const barColor =
    color ??
    getBarColor(
      clampedPct,
      colors.SEMANTIC.SUCCESS,
      colors.SEMANTIC.WARNING,
      colors.SEMANTIC.ERROR,
    );

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${widthPct.value}%` as unknown as number,
  }));

  return (
    <View style={[styles.track, { height, backgroundColor: colors.DIVIDER }]}>
      <Animated.View
        style={[
          styles.fill,
          { height, backgroundColor: barColor },
          animatedStyle,
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    width: "100%",
    borderRadius: RADIUS.FULL,
    overflow: "hidden",
  },
  fill: {
    borderRadius: RADIUS.FULL,
  },
});
