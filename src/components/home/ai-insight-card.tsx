/**
 * AiInsightCard — Swipeable AI Insight notification stack.
 *
 * Features:
 *  - Full swipe left/right → dismiss current card, reveal next behind it
 *  - Partial swipe → peek at the next card, then snap back
 *  - X button → instant dismiss
 *  - Green/amber/red left border per insight type
 *  - Stacked card effect (next card visible behind at smaller scale)
 */

import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Dimensions,
} from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import { useTheme } from "../../hooks/use-theme";
import {
  SPACING,
  RADIUS,
  FONT_SIZE,
  FONT_WEIGHT,
  TOUCH_TARGET,
} from "../../constants/sizes";
import type { MockAiInsight } from "../../services/mock/mock-data";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface AiInsightCardProps {
  insights: MockAiInsight[];
}

const ACCENT_COLORS: Record<MockAiInsight["type"], string> = {
  positive: "#10B981",
  warning: "#F59E0B",
  negative: "#EF4444",
};

const ICON_MAP: Record<MockAiInsight["type"], string> = {
  positive: "✨",
  warning: "⚠️",
  negative: "🚨",
};

const SCREEN_WIDTH = Dimensions.get("window").width;
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.35;

export const AiInsightCard: React.FC<AiInsightCardProps> = ({ insights }) => {
  const { colors } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);

  const translateX = useSharedValue(0);

  const dismissCurrent = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setCurrentIndex((prev) => prev + 1);
    translateX.value = 0;
  }, [translateX]);

  const handleXDismiss = useCallback(() => {
    translateX.value = withTiming(-SCREEN_WIDTH, { duration: 250 }, () => {
      runOnJS(dismissCurrent)();
    });
  }, [translateX, dismissCurrent]);

  // Nothing left to show
  if (currentIndex >= insights.length) return null;

  const current = insights[currentIndex];
  const next =
    currentIndex + 1 < insights.length ? insights[currentIndex + 1] : null;
  const accent = ACCENT_COLORS[current.type];

  const panGesture = Gesture.Pan()
    .activeOffsetX([-10, 10])
    .onUpdate((e) => {
      translateX.value = e.translationX;
    })
    .onEnd((e) => {
      if (Math.abs(e.translationX) > SWIPE_THRESHOLD) {
        // Full swipe — dismiss
        const direction = e.translationX > 0 ? SCREEN_WIDTH : -SCREEN_WIDTH;
        translateX.value = withTiming(direction, { duration: 200 }, () => {
          runOnJS(dismissCurrent)();
        });
      } else {
        // Snap back
        translateX.value = withSpring(0, { damping: 20, stiffness: 200 });
      }
    });

  const animatedFrontStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
    opacity: withTiming(
      1 - Math.min(Math.abs(translateX.value) / SCREEN_WIDTH, 1),
      { duration: 0 },
    ),
  }));

  // Next card scales up as front card is swiped
  const animatedBackStyle = useAnimatedStyle(() => {
    const progress = Math.min(Math.abs(translateX.value) / SWIPE_THRESHOLD, 1);
    return {
      transform: [{ scale: 0.95 + progress * 0.05 }],
      opacity: 0.5 + progress * 0.5,
    };
  });

  return (
    <View style={styles.wrapper}>
      {/* Back card (next insight) */}
      {next && (
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.SURFACE_1,
              borderLeftColor: ACCENT_COLORS[next.type],
            },
            styles.backCard,
            animatedBackStyle,
          ]}
        >
          <Text style={styles.icon}>{ICON_MAP[next.type]}</Text>
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: colors.TEXT_TERTIARY }]}>
              AI Insight
            </Text>
            <Text
              style={[styles.message, { color: colors.TEXT_PRIMARY }]}
              numberOfLines={2}
            >
              {next.message}
            </Text>
          </View>
        </Animated.View>
      )}

      {/* Front card (current insight) — swipeable */}
      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.container,
            {
              backgroundColor: colors.SURFACE_1,
              borderLeftColor: accent,
            },
            animatedFrontStyle,
          ]}
        >
          <Text style={styles.icon}>{ICON_MAP[current.type]}</Text>
          <View style={styles.textContainer}>
            <Text style={[styles.label, { color: colors.TEXT_TERTIARY }]}>
              AI Insight
            </Text>
            <Text style={[styles.message, { color: colors.TEXT_PRIMARY }]}>
              {current.message}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleXDismiss}
            style={styles.dismissButton}
            accessibilityLabel="Dismiss insight"
            accessibilityRole="button"
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Text style={[styles.dismissText, { color: colors.TEXT_TERTIARY }]}>
              ✕
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </GestureDetector>

      {/* Pagination dots */}
      {insights.length > 1 && (
        <View style={styles.dotsRow}>
          {insights.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === currentIndex ? accent : colors.TEXT_TERTIARY,
                  opacity: i === currentIndex ? 1 : 0.3,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
  },
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    borderRadius: RADIUS.LG,
    borderLeftWidth: 4,
    padding: SPACING.MD,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  backCard: {
    position: "absolute",
    top: 4,
    left: 0,
    right: 0,
    zIndex: 0,
  },
  icon: {
    fontSize: FONT_SIZE.XL,
    marginRight: SPACING.SM,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
    marginRight: SPACING.XS,
  },
  label: {
    fontSize: FONT_SIZE.XXS,
    fontWeight: FONT_WEIGHT.SEMIBOLD,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: SPACING.XXXS,
  },
  message: {
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.REGULAR,
    lineHeight: FONT_SIZE.SM * 1.5,
  },
  dismissButton: {
    width: TOUCH_TARGET.MIN,
    height: TOUCH_TARGET.MIN,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -SPACING.XS,
    marginRight: -SPACING.XS,
  },
  dismissText: {
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    marginTop: SPACING.SM,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
});
