/**
 * ConfettiCelebration — Full-screen confetti overlay with achievement info.
 *
 * Uses Reanimated to animate ~60 confetti particles falling from the top.
 * Shows the achievement icon, title, and description in a glowing card.
 */

import React, { useEffect, useMemo } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
  FadeIn,
  FadeOut,
  ZoomIn,
  runOnJS,
} from "react-native-reanimated";
import * as Haptics from "expo-haptics";

import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";

// ── Types ───────────────────────────────────────────────────────────────────

interface Props {
  icon: string;
  title: string;
  description: string;
  onDismiss: () => void;
}

// ── Confetti Particle ───────────────────────────────────────────────────────

const SCREEN_W = Dimensions.get("window").width;
const SCREEN_H = Dimensions.get("window").height;

const CONFETTI_COLORS = [
  "#FF6B6B",
  "#FFD93D",
  "#6BCB77",
  "#4D96FF",
  "#FF6EC7",
  "#A78BFA",
  "#F97316",
  "#06D6A0",
  "#E9C46A",
  "#EF476F",
  "#118AB2",
  "#073B4C",
];

interface ConfettiPieceProps {
  index: number;
  total: number;
}

const ConfettiPiece: React.FC<ConfettiPieceProps> = ({ index, total }) => {
  const startX = useMemo(() => Math.random() * SCREEN_W, []);
  const endX = useMemo(() => startX + (Math.random() - 0.5) * 120, [startX]);
  const size = useMemo(() => 6 + Math.random() * 8, []);
  const color = useMemo(
    () => CONFETTI_COLORS[index % CONFETTI_COLORS.length],
    [index],
  );
  const delay = useMemo(() => Math.random() * 800, []);
  const duration = useMemo(() => 1800 + Math.random() * 1200, []);
  const isCircle = useMemo(() => Math.random() > 0.5, []);

  const translateY = useSharedValue(-20);
  const translateX = useSharedValue(startX);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withDelay(
      delay,
      withTiming(SCREEN_H + 50, { duration, easing: Easing.out(Easing.quad) }),
    );
    translateX.value = withDelay(
      delay,
      withTiming(endX, { duration, easing: Easing.inOut(Easing.sin) }),
    );
    rotate.value = withDelay(
      delay,
      withTiming(360 * (Math.random() > 0.5 ? 1 : -1) * 3, { duration }),
    );
    opacity.value = withDelay(
      delay + duration * 0.7,
      withTiming(0, { duration: duration * 0.3 }),
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        {
          position: "absolute",
          top: -20,
          left: 0,
          width: size,
          height: isCircle ? size : size * 2.5,
          backgroundColor: color,
          borderRadius: isCircle ? size / 2 : 2,
        },
        animatedStyle,
      ]}
    />
  );
};

// ── Main Component ──────────────────────────────────────────────────────────

export const ConfettiCelebration: React.FC<Props> = ({
  icon,
  title,
  description,
  onDismiss,
}) => {
  const confettiPieces = useMemo(
    () => Array.from({ length: 60 }, (_, i) => i),
    [],
  );

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  return (
    <Animated.View
      entering={FadeIn.duration(300)}
      exiting={FadeOut.duration(300)}
      style={styles.overlay}
    >
      {/* Confetti */}
      <View style={StyleSheet.absoluteFill} pointerEvents="none">
        {confettiPieces.map((i) => (
          <ConfettiPiece key={i} index={i} total={60} />
        ))}
      </View>

      {/* Achievement Card */}
      <Pressable style={styles.touchArea} onPress={onDismiss}>
        <Animated.View
          entering={ZoomIn.delay(200).duration(500).springify()}
          style={styles.card}
        >
          <View style={styles.badgeGlow}>
            <Text style={styles.badgeIcon}>{icon}</Text>
          </View>
          <Text style={styles.celebrateText}>🎉 Achievement Unlocked!</Text>
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.descText}>{description}</Text>
          <Text style={styles.tapHint}>Tap anywhere to dismiss</Text>
        </Animated.View>
      </Pressable>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.75)",
    zIndex: 9999,
    justifyContent: "center",
    alignItems: "center",
  },
  touchArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  card: {
    backgroundColor: "#1A1A2E",
    borderRadius: RADIUS.XL,
    padding: SPACING.XL,
    alignItems: "center",
    width: "80%",
    maxWidth: 320,
    borderWidth: 2,
    borderColor: BRAND.PRIMARY_START,
    shadowColor: BRAND.PRIMARY_START,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 30,
    shadowOpacity: 0.4,
    elevation: 20,
  },
  badgeGlow: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(108,99,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: SPACING.MD,
  },
  badgeIcon: {
    fontSize: 48,
  },
  celebrateText: {
    fontSize: FONT_SIZE.SM,
    color: "#FFD93D",
    fontWeight: FONT_WEIGHT.BOLD,
    marginBottom: SPACING.XS,
    letterSpacing: 1,
  },
  titleText: {
    fontSize: FONT_SIZE.XL,
    color: "#FFFFFF",
    fontWeight: FONT_WEIGHT.BOLD,
    textAlign: "center",
    marginBottom: SPACING.XS,
  },
  descText: {
    fontSize: FONT_SIZE.MD,
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    marginBottom: SPACING.LG,
  },
  tapHint: {
    fontSize: FONT_SIZE.XS,
    color: "rgba(255,255,255,0.3)",
  },
});
