import React, { useEffect } from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  interpolateColor,
} from "react-native-reanimated";
import { useTheme } from "../../hooks/use-theme";

interface SkeletonProps {
  style?: ViewStyle | ViewStyle[];
  width?: number | string;
  height?: number | string;
  borderRadius?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  style,
  width,
  height = 20,
  borderRadius = 8,
}) => {
  const { isDark } = useTheme();
  const animation = useSharedValue(0);

  useEffect(() => {
    animation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 }),
      ),
      -1,
      false,
    );
  }, [animation]);

  const animatedStyle = useAnimatedStyle(() => {
    const colorStart = isDark
      ? "rgba(255, 255, 255, 0.05)"
      : "rgba(0, 0, 0, 0.05)";
    const colorEnd = isDark
      ? "rgba(255, 255, 255, 0.15)"
      : "rgba(0, 0, 0, 0.12)";
    const bgColor = interpolateColor(
      animation.value,
      [0, 1],
      [colorStart, colorEnd],
    );

    return {
      backgroundColor: bgColor,
    };
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width: width as any, height: height as any, borderRadius },
        animatedStyle,
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    overflow: "hidden",
  },
});
