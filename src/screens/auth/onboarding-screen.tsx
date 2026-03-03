/**
 * OnboardingScreen — 3-slide welcome carousel
 *
 * Auto-advances or swipable slides with:
 *  1. Track spending
 *  2. Set budgets & goals
 *  3. Unlock achievements
 *
 * "Get Started" button at the bottom.
 */

import React, { useState, useCallback, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInUp, FadeIn } from "react-native-reanimated";

import { Routes } from "../../constants/routes";
import { FONT_SIZE, FONT_WEIGHT, SPACING, RADIUS } from "../../constants/sizes";
import { BRAND } from "../../constants/colors";

const { width: SCREEN_W } = Dimensions.get("window");

// ── Slide Data ──────────────────────────────────────────────────────────────

const SLIDES = [
  {
    emoji: "📊",
    title: "Track Every Rupee",
    description:
      "Effortlessly log your income and expenses.\nSee where your money goes with beautiful charts.",
    gradient: ["#6C63FF", "#4F46E5"] as const,
  },
  {
    emoji: "🎯",
    title: "Smart Budgets",
    description:
      "Set category budgets and get real-time alerts\nwhen spending approaches your limits.",
    gradient: ["#10B981", "#059669"] as const,
  },
  {
    emoji: "🏆",
    title: "Earn Achievements",
    description:
      "Unlock 42 badges as you build better money habits.\nConfetti celebrations included! 🎉",
    gradient: ["#F59E0B", "#D97706"] as const,
  },
];

// ── Component ───────────────────────────────────────────────────────────────

export const OnboardingScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleGetStarted = useCallback(() => {
    (navigation as any).replace(Routes.LOGIN);
  }, [navigation]);

  const handleNext = useCallback(() => {
    if (activeIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      handleGetStarted();
    }
  }, [activeIndex, handleGetStarted]);

  const handleSkip = useCallback(() => {
    handleGetStarted();
  }, [handleGetStarted]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems.length > 0) {
      setActiveIndex(viewableItems[0].index ?? 0);
    }
  }).current;

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0A0A1B", "#1A1A2E", "#0A0A1B"]}
        style={StyleSheet.absoluteFill}
      />

      <SafeAreaView style={styles.safeArea} edges={["top", "bottom"]}>
        {/* Skip */}
        <Pressable onPress={handleSkip} style={styles.skipBtn}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>

        {/* Slides */}
        <FlatList
          ref={flatListRef}
          data={SLIDES}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          keyExtractor={(_, i) => String(i)}
          renderItem={({ item, index }) => (
            <View style={styles.slide}>
              <Animated.View
                entering={FadeIn.delay(300).duration(600)}
                style={[
                  styles.emojiCircle,
                  { backgroundColor: `${item.gradient[0]}20` },
                ]}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
              </Animated.View>
              <Animated.Text
                entering={FadeInUp.delay(400).duration(500)}
                style={styles.slideTitle}
              >
                {item.title}
              </Animated.Text>
              <Animated.Text
                entering={FadeInUp.delay(500).duration(500)}
                style={styles.slideDesc}
              >
                {item.description}
              </Animated.Text>
            </View>
          )}
        />

        {/* Dots */}
        <View style={styles.dotRow}>
          {SLIDES.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor:
                    i === activeIndex
                      ? BRAND.PRIMARY_START
                      : "rgba(255,255,255,0.2)",
                  width: i === activeIndex ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        {/* CTA */}
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.ctaWrapper,
            pressed && { opacity: 0.8 },
          ]}
        >
          <LinearGradient
            colors={[BRAND.PRIMARY_START, BRAND.PRIMARY_END]}
            style={styles.ctaGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Text style={styles.ctaText}>
              {activeIndex === SLIDES.length - 1 ? "Get Started" : "Next"}
            </Text>
          </LinearGradient>
        </Pressable>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  skipBtn: {
    position: "absolute",
    top: SPACING.LG,
    right: SPACING.LG,
    zIndex: 10,
    padding: SPACING.SM,
  },
  skipText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: FONT_SIZE.SM,
    fontWeight: FONT_WEIGHT.MEDIUM,
  },
  slide: {
    width: SCREEN_W,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: SPACING.XL,
  },
  emojiCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: SPACING.XL,
  },
  emoji: {
    fontSize: 56,
  },
  slideTitle: {
    fontSize: 28,
    fontWeight: FONT_WEIGHT.BOLD,
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: SPACING.MD,
  },
  slideDesc: {
    fontSize: FONT_SIZE.MD,
    color: "rgba(255,255,255,0.6)",
    textAlign: "center",
    lineHeight: 24,
  },
  dotRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.XS,
    paddingBottom: SPACING.XL,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  ctaWrapper: {
    marginHorizontal: SPACING.XL,
    marginBottom: SPACING.XL,
    borderRadius: RADIUS.MD,
    overflow: "hidden",
  },
  ctaGradient: {
    paddingVertical: SPACING.MD + 2,
    alignItems: "center",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: FONT_SIZE.MD,
    fontWeight: FONT_WEIGHT.BOLD,
    letterSpacing: 0.5,
  },
});
